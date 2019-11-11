from flask import Flask
from flask import render_template
from flask import request,json

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
    return json.dumps({'status':'OK'});

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)