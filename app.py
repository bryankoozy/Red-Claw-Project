from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/integrityAI")
def integrityAI():
    return render_template("integrityAI.html")

@app.route("/integrityEdu")
def integrityEdu():
    return render_template("integrityEdu.html")

if __name__ == "__main__":
    app.run(debug=True)
