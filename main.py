from flask import request,json,jsonify,render_template,Flask
from sklearn.cluster import KMeans
from yellowbrick.cluster import KElbowVisualizer,SilhouetteVisualizer
from pgmpy.models import BayesianModel
from pgmpy.estimators import MaximumLikelihoodEstimator
from server.models.mongoDB import *
import numpy as np
import pandas
import server.models.K2


app = Flask(__name__, static_url_path='/static')

#---------------Probably unnaceccery--------------
@app.route('/getExperiments', methods=['GET', 'POST'])
def getExperiments():
    userName=request.form.get('userNameDB')
    experiment_array=[]
    experiments=db.experiments.find({"userName": userName})
    for exp in experiments:
        exp.pop('_id')
        experiment_array.append(exp)
    return jsonify({'experiments':experiment_array})

@app.route('/uploadfile', methods=['GET', 'POST'])
def uploadfile():
    file = request.files.getlist("file")
    df = pandas.read_excel(file[0])
    excel_values=np.array(df.values)
    excel_cols=np.array(df.columns.values)
    return jsonify({'excelDetails':excel_values.tolist(),'excelCols':excel_cols.tolist()})
#-------------------------------------------------

@app.route("/")
def hello():
    return render_template('login.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    password = request.form.get('password')
    inputEmail=request.form.get('inputEmail')
    for user in db.users.find({"userName":inputEmail, "userPassword":password}):#, "status":"Disconnected"}):
        experiment_array = []
        experiments = db.experiments.find({"userName": inputEmail})
        for exp in experiments:
            exp.pop('_id')
            experiment_array.append(exp)
        return jsonify({'experiments': experiment_array})
    return jsonify({'pstatus':"NOT OK"})

@app.route('/register', methods=['GET', 'POST'])
def register():
    password = request.form.get('password')
    inputEmail=request.form.get('inputEmail')
    userFullName=request.form.get('userFullName')
    db.users.insert({
        u'userName': u'' + inputEmail + '',
        u'userPassword': u'' + password + '',
        u'userFullName': u'' + userFullName + '',
        u'status':u'Disconnected'
    })
    return("Registered!")

@app.route('/createExperiment', methods=['GET', 'POST'])
def createExperiment():
    nextId = db.experiments.find_one(sort=[("id", server.models.mongoDB.pymongo.DESCENDING)])
    if(nextId==None):
        nextId=1
    else:
        nextId= int(nextId.pop('id'))+1
    name = request.form.get('name')
    description=request.form.get('description')
    userName=request.form.get('userName')
    db.experiments.insert_one({
        u'id': nextId,
        u'experimentName': u'' + name + '',
        u'experimentDescription': u'' + description + '',
        u'userName': u'' + userName + '',
        u'tasks':[]
    })
    return jsonify({'nextId':nextId})

@app.route('/createTask', methods=['GET', 'POST'])
def createTask():
    dataset = json.loads(request.form['dataset'])
    datasetcols = json.loads(request.form['datasetcols'])
    name=request.form.get('taskname')
    description=request.form.get('taskDescription')
    current_experiment_id=int(request.form.get('current_experiment'))
    nextId = db.experiments.find_one({"id":current_experiment_id})
    if(len(nextId["tasks"])==0):
        nextId=1
    else:
        nextId= int(nextId["tasks"][-1].pop('task_id'))+1
    myquery = {"id":current_experiment_id }
    newvalues = {"$push": {"tasks": {"task_id":nextId,"taskName": name,"taskDescription":description, "datasetcols":datasetcols, "dataset":dataset}}}
    db.experiments.update_one(myquery,newvalues)
    return jsonify({'idTask':nextId})

@app.route('/getTasks', methods=['GET', 'POST'])
def getTasks():
    idExp=request.form.get('idExp')
    tasks_array=[]
    tasks=db.tasks.find({"idExp": idExp})
    for task in tasks:
        task.pop('_id')
        tasks_array.append(task)
    return jsonify({'tasks':tasks_array})

@app.route('/goKmeans', methods=['GET', 'POST'])
def goKmeans():
    clusteringNum = request.form['clusteringNum']
    dataset = json.loads(request.form.get('dataset'))
    if(clusteringNum=='' or int(float(clusteringNum))<2):
      clusteringNum=2
    dataset = np.array(dataset)
    new_list = list(list(float(a) for a in b if is_number(a)) for b in dataset)
    kmeans = KMeans(n_clusters=int(float(clusteringNum)), random_state=0).fit(new_list)
    new_list_as_array=np.array(new_list)
    SilhouetteVisualize = SilhouetteVisualizer(kmeans)
    SilhouetteVisualize.fit(new_list_as_array)
    if(len(new_list)>10):
        k_upper_bound=10
    else:
        k_upper_bound=len(new_list)
    KElbowVisualize = KElbowVisualizer(KMeans(), k=k_upper_bound)
    KElbowVisualize.fit(new_list_as_array)  # Fit the data to the visualizer
    silhouette = SilhouetteVisualize.silhouette_score_
    elbow = KElbowVisualize.elbow_value_
    return jsonify({'inputArray': list(new_list),'kmeansLabels':(kmeans.labels_.tolist()),'elbowValue':str(elbow),'silhouetteValue':('%.3f' % silhouette)})

@app.route('/goK2', methods=['GET', 'POST'])
def goK2():
    cpds_list={}
    cpds_array=[]
    categories = json.loads(request.form['datasetcols'])
    dataset = json.loads(request.form['dataset'])
    data = list(list(int(a) for a in b if a.isdigit()) for b in dataset)
    data = np.array(data)

    # initialize "the blob" and map its variable names to indicies
    g = server.models.K2.data_blob(data)

    mapping = server.models.K2.map_categories(categories)
    # set the maximum number of parents any node can have
    iters = 1
    p_lim_max = 5
    # iterate from p_lim_floor to p_lim_max with random restart
    p_lim_floor = 4
    best_score = -10e10
    best_dag = np.zeros((1, 1))
    for i in range(iters):
        for u in range(p_lim_floor, p_lim_max):
            # generate random ordering
            order = np.arange(g.var_number)
            (dag, k2_score) = server.models.K2.k2(g, order, u, data)
            score = np.sum(k2_score)
            if (score > best_score):
                server.models.K2.best_score = score
                best_dag = dag

    graph_list=server.models.K2.graph_out(dag, mapping)

    #Finding the Conditional Probabilities Tables
    model = BayesianModel()
    model.add_nodes_from(list(mapping))
    for value in graph_list:
        temp_list=value.split(',')
        model.add_edge(temp_list[0],temp_list[1])
    data_dict = {mapping[i]: data[:,i] for i in range(0, len(mapping))}
    data_dict_pd = pandas.DataFrame(data=data_dict)
    model.fit(data_dict_pd)
    cpds_tables=model.get_cpds()
    for cpd in cpds_tables:
        if(len(cpd.values.shape)!=1):
            li = list(list(j) for j in cpd.values)
            cpds_list[str(list(cpd.variables))]= li
        else:
            cpds_list[str(list(cpd.variables))]=list(cpd.values)
        cpds_array.append(cpds_list)
    print(score)
    print(dag)
    return jsonify({'status': 'done','dataset_k2':dag.tolist(),'categories':categories,'cpt_list':cpds_array})

#------------------functions-------------------
def is_number(s):
    try:
        float(s)
        return True
    except ValueError:
        return False
#----------------------------------------------
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)