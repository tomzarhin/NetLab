from flask import Flask

app = Flask(__name__)
app.run()

@app.route("/")
def main():
    return "Welcome!"
