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
    for user in db.users.find({"userName":inputEmail, "userPassword":password}):
        return render_template('home.html')
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    password = request.form.get('password')
    inputEmail=request.form.get('inputEmail')
    userFullName=request.form.get('userFullName')
    db.users.insert({
        u'userName': u'' + inputEmail + '',
        u'userPassword': u'' + password + '',
        u'userFullName': u'' + userFullName + ''
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
    return json.dumps({'status':'OK'})

@app.route('/getExperiments', methods=['GET', 'POST'])
def getExperiments():
    #userName=request.form.get('userName')
    userName='tom'
    experiment_array=[]
    experiments=db.experiments.find({"userName": userName})
    for exp in experiments:
        exp.pop('_id')
        experiment_array.append(exp)
    return jsonify({'experiments':experiment_array})
    return json.dumps({'status':'OK','experiments':experiment_array})

@app.route('/uploadfile', methods=['GET', 'POST'])
def uploadfile():
    file = request.files.getlist("file")
    df = pandas.read_excel(file[0], sheet_name='Sheet1')
    excel_array=[]
    for value in df.columns.values:
        excel_array.append(value)
    excel_array.append(",")
    for row in np.array(df.head()):
        for value in row:
            excel_array.append(value)
        excel_array.append(",")
    return jsonify({'excelDetails':excel_array})

@app.route('/goKmeans', methods=['GET', 'POST'])
def goKmeans():
   clusteringNum = request.form['clusteringNum']
   dataset = request.form['dataset']
   #x_values,y_values=readDataFromExcelFileTraining(file[0]) #loading data from excel
   if(clusteringNum=='' or int(float(clusteringNum))<2):
      clusteringNum=2
   kmeans = KMeans(n_clusters=int(float(clusteringNum)), random_state=0).fit(x_values,y_values)
   kmeans.labels_
   return jsonify({'kmeansLabels': kmeans.labels_})

#-------------------Functions-------------------
def readDataFromExcelFileTraining(filename):
   #Read from the excel file
   df = pandas.read_excel(filename, sheet_name='Sheet1')
   values=np.matrix(df.values)
   match=np.array(df.values)
   y_values=match[:,-1]
   x_values = np.delete(values,-1,1)
   return(x_values,y_values)
#-----------------------------------------------

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)