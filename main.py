from flask import Flask
from flask import render_template

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

cred = credentials.Certificate('./serviceAccount.json')
firebase_admin.initialize_app(cred)

db = firestore.client()
app = Flask(__name__, static_url_path='/static')

@app.route("/")
def hello():
     #[START quickstart_add_data_one]
    doc_ref = db.collection(u'users').document(u'tomzarhin')
    doc_ref.set({
        u'first': u'Tom',
        u'last': u'Zarhin',
        u'born': 1815
    })
     #[END quickstart_add_data_one]
    return render_template('home.html')

@app.route("/login")
def login():
    return "tom!"

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)