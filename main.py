from flask import Flask
from firebase import firebase

app = Flask(__name__)

@app.route("/")
def hello():
    return "NetLab!"

@app.route("/login")
def login():
    return "tom!"

if __name__ == '__main__':
    firebase = firebase.FirebaseApplication('https://netlab-dfb99.firebaseio.com', None)
    result = firebase.get('/users', None)
    print result
    app.run(host='127.0.0.1', port=8080, debug=True)