from flask import request,json,jsonify,render_template,Flask
#-----need to be tested----
import pandas
from sklearn.cluster import KMeans
import numpy as np
#--------------------------

import pymongo

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
    db.experiments.insert({
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
    return json.dumps({'pstatus':'OK','experiments':experiment_array})

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

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)