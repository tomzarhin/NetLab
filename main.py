from flask import Flask
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use a service account
#cred = credentials.Certificate('./serviceAccount.json')
#firebase_admin.initialize_app(cred)

#db = firestore.client()
app = Flask(__name__)

@app.route("/")
def hello():
    #db = firestore.Client()
    # [START quickstart_add_data_one]
    #doc_ref = db.collection(u'users').document(u'alovelace')
    #doc_ref.set({
    #    u'first': u'Ada',
    #    u'last': u'Lovelace',
    #    u'born': 1815
    #})
    # [END quickstart_add_data_one]
    return "YES!"

@app.route("/login")
def login():
    return "tom!"

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)