from flask import Flask, render_template, request, redirect, url_for, flash, session, abort
from functools import wraps
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import os
from models import db, User, SupportMessage



# only uncomment and use the below line during development mode. comment it when going to production
# os.environ['FLASK_ENV'] = 'development'



ENV = os.getenv('FLASK_ENV', 'production')

# Load dotenv based on ENV
if ENV == 'production':
    load_dotenv('.env.prod')
else:
    load_dotenv('.env.dev')

app = Flask(__name__)



app.config['ENV'] = ENV  # explicitly set it here
app.secret_key = os.getenv('SECRET_KEY')

app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)






@app.context_processor
def inject_user():
    if 'user_id' in session:
        user = User.query.get(session['user_id'])
        return dict(current_user=user)
    return dict(current_user=None)









def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'error')
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('Please log in to access this page.', 'error')
            return redirect(url_for('login'))

        user = User.query.get(session['user_id'])
        if not user or user.role != 'admin':
            abort(403)  # Forbidden
        return f(*args, **kwargs)
    return decorated_function












@app.route("/")
def home():
    return render_template("index.html")

@app.route("/dashboard")
@admin_required
def dashboard():
    user = User.query.get(session['user_id'])
    return render_template("dashboard.html", user=user)


@app.route("/integrityAI")
@login_required
def integrityAI():
    user = User.query.get(session['user_id'])
    return render_template("integrityAI.html", user=user)

@app.route("/integrityEdu")
@login_required
def integrityEdu():
    user = User.query.get(session['user_id'])
    return render_template("integrityEdu.html", user=user)













@app.route("/settings", methods=["GET", "POST"])
@login_required
def settings():
    user = User.query.get(session['user_id'])

    if request.method == "POST":
        action = request.form.get('action')

        if action == "update_username":
            new_username = request.form.get('new_username').strip()
            if new_username:
                user.name = new_username
                db.session.commit()
                flash("Username updated successfully!", "success")
            else:
                flash("Invalid username.", "error")

        elif action == "update_email":
            new_email = request.form.get('new_email').strip()
            if new_email:
                existing = User.query.filter(User.email == new_email, User.id != user.id).first()
                if existing:
                    flash("Email already taken.", "error")
                else:
                    user.email = new_email
                    db.session.commit()
                    flash("Email updated successfully!", "success")
            else:
                flash("Invalid email.", "error")

        elif action == "update_password":
            current_password = request.form.get('current_password')
            new_password = request.form.get('new_password')
            confirm_password = request.form.get('confirm_password')

            if not all([current_password, new_password, confirm_password]):
                flash("Please fill all password fields.", "error")
            elif not check_password_hash(user.password, current_password):
                flash("Current password is incorrect.", "error")
            elif new_password != confirm_password:
                flash("New passwords do not match.", "error")
            else:
                user.password = generate_password_hash(new_password)
                db.session.commit()
                flash("Password updated successfully!", "success")

        elif action == "contact":
            subject = request.form.get('subject').strip()
            message = request.form.get('message').strip()
            if subject and message:
                # Process message (email or DB)
                flash("Message sent successfully!", "success")
            else:
                flash("Please fill in both subject and message.", "error")

        return redirect(url_for('settings'))

    return render_template("settings.html", user=user)








@app.route('/login', methods=['GET', 'POST'])
def login():
    if 'user_id' in session:
        flash('You are currently logged in.', 'info')
        return redirect(url_for('home'))
    
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        # Find user by email
        user = User.query.filter_by(email=email).first()
        
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            flash('Login successful!', 'success')
            return redirect(url_for('home'))
        else:
            flash('Invalid email or password.', 'error')

    return render_template('login.html')








@app.route('/register', methods=['GET', 'POST'])
def register():
    if 'user_id' in session:
        flash('You are currently logged in.', 'info')
        return redirect(url_for('home'))
    
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        password = request.form['password']
        confirm = request.form['confirmPassword']
        
        # Validate passwords match
        if password != confirm:
            flash('Passwords do not match.', 'error')
            return render_template('register.html')
        
        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            flash('Email already registered. Please use a different email.', 'error')
            return render_template('register.html')
        
        # Create new user
        hashed_password = generate_password_hash(password)
        new_user = User(name=name, email=email, password=hashed_password)
        
        try:
            db.session.add(new_user)
            db.session.commit()
            flash('Registration successful! Please log in.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            db.session.rollback()
            flash('Registration failed. Please try again.', 'error')
            print(f"Database error: {e}")

    return render_template('register.html')











@app.route('/logout')
def logout():
    if 'user_id' in session:
        session.pop('user_id')
        flash('You have been logged out successfully.', 'success')
    else:
        flash('You are not logged in.', 'error')
    return redirect(url_for('home'))









if __name__ == "__main__":
    with app.app_context():
        db.create_all()

        admin_email = 'admin@example.com'
        admin = User.query.filter_by(email=admin_email).first()

        if not admin:
            hashed_password = generate_password_hash('your_admin_password')  # Change this
            admin = User(name='Admin', email=admin_email, password=hashed_password, role='admin')
            db.session.add(admin)
            db.session.commit()
            print("Admin account created.")
        else:
            print("Admin account already exists.")

    app.run(host='0.0.0.0', port=5000, debug=True)