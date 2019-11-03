from flask import Flask
import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use the application default credentials
cred = credentials.ApplicationDefault()
firebase_admin.initialize_app(cred, {
  'projectId': project_id,
})

db = firestore.client()
app = Flask(__name__)

@app.route("/")
def hello():
    doc_ref = db.collection(u'users').document(u'alovelace')
    doc_ref.set({
        u'first': u'Ada',
        u'last': u'Lovelace',
        u'born': 1815
    })
    return "YES!"

@app.route("/login")
def login():
    return "tom!"

if __name__ == '__main__':

    app.run(host='127.0.0.1', port=8080, debug=True)