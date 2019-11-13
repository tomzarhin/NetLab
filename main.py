from flask import request,json,jsonify,render_template,Flask
#-----need to be tested----
import pandas
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
    #if (file[1] != None):
    #    file[1].save(secure_filename(file[1].filename))
    #else:
    #    return ("No file")
    #makeNewFile(file[1])
    df = pandas.read_excel(file[0], sheet_name='Sheet1')
    print(np.array(df.values))
    return jsonify({'excelDetails':np.array(df.to_records())})

#--------------------------Functions------------------------------
#def makeNewFile(name):
   #df = pandas.read_excel(name, sheet_name='Sheet1')
   #writer = pandas.ExcelWriter('excel_to_send.xlsx', engine='xlsxwriter')
   #df.to_excel(writer, sheet_name='Sheet1')
   #writer.save()
#------------------------------------------------------------------

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)