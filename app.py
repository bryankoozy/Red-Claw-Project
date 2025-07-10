from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = "your_secret_key_here"  # needed for flash messages



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

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        # TODO: Add your login validation logic here

        # Example dummy logic:
        if email == 'test@example.com' and password == 'password':
            flash('Login successful!', 'success')
            return redirect(url_for('home'))
        else:
            flash('Invalid email or password.', 'error')

    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        confirm = request.form['confirmPassword']
        
        # TODO: Add your registration logic here
        if password != confirm:
            flash('Passwords do not match.', 'error')
            return render_template('register.html')
        
        # Example dummy logic to succeed:
        flash('Registration successful! Please log in.', 'success')
        return redirect(url_for('login'))

    return render_template('register.html')


if __name__ == "__main__":
    app.run(debug=True)
