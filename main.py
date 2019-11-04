from flask import Flask
from flask import render_template
from flask import request

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('./serviceAccount.json')
firebase_admin.initialize_app(cred)

db = firestore.client()
app = Flask(__name__, static_url_path='/static')

@app.route("/")
def hello():
    #doc_ref = db.collection(u'users').document(u'tomzarhin')
    #doc_ref.set({
     #    u'first': u'Tom',
     #   u'last': u'Zarhin',
     #   u'born': 1815
    #})

    return render_template('home.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    #url = 'http://127.0.0.1:8080/'
    #x = req.get("http://127.0.0.1:8080/login")
    user = request.form.getlist('user')
    password = user.get('password')
    inputEmail=user.get('inputEmail')
    print(password)
    print(inputEmail)
    return password

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)