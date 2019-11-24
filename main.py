from flask import request,json,jsonify,render_template,Flask
from sklearn.cluster import KMeans
import numpy as np
import pymongo
import pandas
import server.K2

client = pymongo.MongoClient("mongodb+srv://admin:admin@netlab-keluq.azure.mongodb.net/netlabdb?retryWrites=true&w=majority")
db = client.netlabdb

app = Flask(__name__, static_url_path='/static')

@app.route("/")
def hello():
    return render_template('login.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    password = request.form.get('password')
    inputEmail=request.form.get('inputEmail')
    for user in db.users.find({"userName":inputEmail, "userPassword":password}):#, "status":"Disconnected"}):
        myquery = {"userName": user['userName']}
        newvalues = {"$set": {"status": "Connected"}}
        db.users.update_one(myquery, newvalues)
        return jsonify({'pstatus':"OK"})
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
    name = request.form.get('name')
    description=request.form.get('description')
    userName=request.form.get('userName')
    idExp = request.form.get('id')
    db.experiments.insert({
        u'id': u'' + idExp + '',
        u'experimentName': u'' + name + '',
        u'experimentDescription': u'' + description + '',
        u'userName': u'' + userName + ''
    })
    return json.dumps({'pstatus':'OK'})

@app.route('/getExperiments', methods=['GET', 'POST'])
def getExperiments():
    userName=request.form.get('userNameDB')
    experiment_array=[]
    experiments=db.experiments.find({"userName": userName})
    for exp in experiments:
        exp.pop('_id')
        experiment_array.append(exp)
    return jsonify({'experiments':experiment_array})

@app.route('/getNextId', methods=['GET', 'POST'])
def getNextId():
    maxId=0
    experiments=db.experiments.find()
    for exp in experiments:
        curr = int(exp.pop('id'))
        if curr > maxId:
            maxId = curr
    nextId=str(maxId+1)
    return jsonify({'nextId':nextId})

@app.route('/getTasks', methods=['GET', 'POST'])
def getTasks():
    idExp=request.form.get('idExp')
    tasks_array=[]
    tasks=db.tasks.find({"idExp": idExp})
    for task in tasks:
        task.pop('_id')
        tasks_array.append(task)
    return jsonify({'tasks':tasks_array})

@app.route('/uploadfile', methods=['GET', 'POST'])
def uploadfile():
    file = request.files.getlist("file")
    df = pandas.read_excel(file[0], sheet_name='Sheet1')
    excel_values=np.array(df.values)
    excel_cols=np.array(df.columns.values)
    return jsonify({'excelDetails':excel_values.tolist(),'excelCols':excel_cols.tolist()})

@app.route('/goKmeans', methods=['GET', 'POST'])
def goKmeans():
    clusteringNum = request.form['clusteringNum']
    dataset = json.loads(request.form['dataset'])
    if(clusteringNum=='' or int(float(clusteringNum))<2):
      clusteringNum=2
    new_list = list(list(int(a) for a in b if a.isdigit()) for b in dataset)
    kmeans = KMeans(n_clusters=int(float(clusteringNum)), random_state=0).fit(new_list)
    #centers = np.array(kmeans.cluster_centers_)
    new_list = np.array(new_list)
    return jsonify({'inputArray': new_list.tolist(),'kmeansLabels':kmeans.labels_.tolist()})

@app.route('/goK2', methods=['GET', 'POST'])
def goK2():
    data_set = 'data/titanic.csv'
    categories = np.genfromtxt(data_set, delimiter=',', max_rows=1, dtype=str)
    data = K2.genfromtxt(data_set, dtype='int64', delimiter=',', skip_header=True)

    # initialize "the blob" and map its variable names to indicies
    g = data_blob(data)

    mapping = map_categories(categories)
    # set the maximum number of parents any node can have
    iters = 1
    p_lim_max = 5
    # iterate from p_lim_floor to p_lim_max with random restart
    p_lim_floor = 4
    best_score = -10e10
    best_dag = np.zeros((1, 1))
    time.clock()
    for i in range(iters):
        for u in range(p_lim_floor, p_lim_max):
            # generate random ordering
            order = np.arange(g.var_number)
            (dag, k2_score) = k2(g, order, u)
            score = np.sum(k2_score)
            if (score > best_score):
                best_score = score
                best_dag = dag

    filename = 'graph_out/titanic.gph'
    graph_out(dag, filename, mapping)
    print(score)
    print(dag)
    print(time.clock())


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)