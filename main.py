"""
__author__ = "Tom Zarhin", "Or Edri"
__copyright__ = "Copyright 2019, The Netlab Project"
__credits__ = "Anat Dahan"
__license__ = "GPL"
__version__ = "1.0.0"
__maintainer__ = "Tom Zarhin"
__email__ = "Tom Zarhin@s.braude.ac.il"
__status__ = "Production"
"""

from flask import request,json,jsonify,render_template,Flask
from sklearn.cluster import KMeans
from yellowbrick.cluster import KElbowVisualizer,SilhouetteVisualizer
from pgmpy.models import BayesianModel
from pgmpy.estimators import MaximumLikelihoodEstimator
from server.models.mongoDB import Mongo
import server.models.K2 as K2
import numpy as np
import pandas
import random

app = Flask(__name__, static_url_path='/static')
mongo=Mongo()
#------------------functions-------------------
def is_number(s):
# Getting a character and returning if it is a number
# Author: Tom Zarhin
    try:
        float(s)
        return True
    except ValueError:
        return False

def bayesValidation(data,mapping,graph_list):
# Performing prediction using a bayesian network model
# Author: Tom Zarhin

    #values = pandas.DataFrame(np.random.randint(low=0, high=2, size=(1000, 5)),
    #columns = ['A', 'B', 'C', 'D', 'E'])
    random.shuffle(data)
    train_pct_index = int(0.8 * len(data))
    train_data = data[:train_pct_index]
    predict_data = data[train_pct_index:]
    bayes_model=createBayesGraph(graph_list,mapping,train_data)
    bayes_model.fit(data)
    predict_data = predict_data.copy()
    predict_data.drop('E', axis=1, inplace=True)#fix it
    y_pred = bayes_model.predict(predict_data)
    return y_pred

def createBayesGraph(graph_list,mapping,data):
# Creating bayesian network graph function
# Author: Tom Zarhin
    bayes_model = BayesianModel()
    bayes_model.add_nodes_from(list(mapping))
    for value in graph_list:
        temp_list=value.split(',')
        bayes_model.add_edge(temp_list[0],temp_list[1])
    data_dict = {mapping[i]: data[:,i] for i in range(0, len(mapping))}
    data_dict_pd = pandas.DataFrame(data=data_dict)
    bayes_model.fit(data_dict_pd)
    return(bayes_model)
#----------------------------------------------

#---------------Probably unnaceccery--------------
@app.route('/getExperiments', methods=['GET', 'POST'])
#Getting the experiments of the user
#Author: Tom Zarhin
def getExperiments():
    userName=request.form.get('userNameDB')
    experiment_array=mongo.getExperiments(userName)
    return jsonify({'experiments':experiment_array})

@app.route('/uploadfile', methods=['GET', 'POST'])
#Getting file from the client and returning an array representing the file
#Author: Tom Zarhin
def uploadfile():
    file = request.files.getlist("file")
    df = pandas.read_excel(file[0])
    excel_values=np.array(df.values)
    excel_cols=np.array(df.columns.values)
    return jsonify({'excelDetails':excel_values.tolist(),'excelCols':excel_cols.tolist()})

@app.route('/getTasks', methods=['GET', 'POST'])
#Get The tasks of the user
#Author: Tom Zarhin
def getTasks():
    idExp=request.form.get('idExp')
    tasks_array=mongo.getTask(idExp)
    return jsonify({'tasks':tasks_array})
#-------------------------------------------------

@app.route("/")
#Getting the experiments of the user
#Author: Tom Zarhin
def netLabStart():
    return render_template('login.html')

@app.route('/login', methods=['GET', 'POST'])
#Getting the user details and returning his experiments if he exist or else the function returning null
#Author: Tom Zarhin
def login():
    inputEmail=request.form.get('inputEmail')
    password = request.form.get('password')
    experiment_array=mongo.login(inputEmail,password)
    if(experiment_array==None):
        return jsonify({'pstatus':"NOT OK"})
    return jsonify({'experiments': experiment_array})

@app.route('/register', methods=['GET', 'POST'])
#Getting the user details and creating a new task
#Author: Tom Zarhin
def register():
    inputEmail=request.form.get('inputEmail')
    password = request.form.get('password')
    userFullName=request.form.get('userFullName')
    ack=mongo.register(inputEmail,password,userFullName)
    return jsonify({'nextId':ack})

@app.route('/createExperiment', methods=['GET', 'POST'])
#Getting the experiment details and creating a new one
#Author: Tom Zarhin
def createExperiment():
    description=request.form.get('description')
    userName=request.form.get('userName')
    name = request.form.get('name')
    nextId=mongo.createExperiment(description,userName,name)
    return jsonify({'nextId':nextId})

@app.route('/createTask', methods=['GET', 'POST'])
#Getting the tasks details and creating a new one
#Author: Tom Zarhin
def createTask():
    dataset = json.loads(request.form['dataset'])
    datasetcols = json.loads(request.form['datasetcols'])
    name=request.form.get('taskname')
    description=request.form.get('taskDescription')
    current_experiment_id=int(request.form.get('current_experiment'))
    nextId=mongo.createExperiment(dataset,datasetcols,name,description,current_experiment_id)
    return jsonify({'idTask':nextId})

@app.route('/goKmeans', methods=['GET', 'POST'])
#Running Kmeans algorithm for Clustering graph
#Author: Tom Zarhin
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
#Running K2 algorithm for Bayesian Network Correlation
#Author: Tom Zarhin
def goK2():
    cpds_array=[]
    categories = json.loads(request.form['datasetcols'])
    dataset = json.loads(request.form['dataset'])
    data = list(list(int(a) for a in b if a.isdigit()) for b in dataset)
    data = np.array(data)

    # initialize "the blob" and map its variable names to indicies
    g = K2.data_blob(data)

    mapping = K2.map_categories(categories)
    # set the maximum number of parents any node can have
    iters = 1
    p_lim_max = 3
    # iterate from p_lim_floor to p_lim_max with random restart
    p_lim_floor = 1
    best_score = -10e10
    best_dag = np.zeros((1, 1))
    for i in range(iters):
        for u in range(p_lim_floor, p_lim_max):
            # generate random ordering
            order = np.arange(g.var_number)
            (dag, k2_score) = K2.k2(g, order, u, data)
            score = np.sum(k2_score)
            if (score > best_score):
                K2.best_score = score
                best_dag = dag

    graph_list=K2.graph_out(dag, mapping)

    #Finding the Conditional Probabilities Tables
    bayes_model=createBayesGraph(graph_list,mapping,data)
    cpds_tables=bayes_model.get_cpds()

    for cpd in cpds_tables:
        cpds_list={}

        cpd_string = str(cpd).split('|')
        temp_array = []
        cpd_matrix_values = []
        digits_numbers = 0

        for a in cpd_string:
            if (is_number(a)):
                temp_array.append(float(a.strip()))
                digits_numbers+=1
            elif ("-+" in a and digits_numbers != 0):
                cpd_matrix_values.append(temp_array)
                temp_array = []
                digits_numbers = 0

        cpds_list[str(list(cpd.variables))]=cpd_matrix_values
        cpds_array.append(cpds_list)
    print(score)
    print(dag)

    for cpt in cpds_tables:
        print("kaki")
        print(cpt.values)

    return jsonify({'status': 'done','dataset_k2':dag.tolist(),'categories':categories,'cpt_list':cpds_array})


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)