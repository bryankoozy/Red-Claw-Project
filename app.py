from flask import Flask, render_template, request, redirect, url_for, flash, session, abort, send_file, jsonify
from functools import wraps
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func, extract
from werkzeug.security import generate_password_hash, check_password_hash
from dotenv import load_dotenv
import os
from models import db, User, SupportMessage
from collections import OrderedDict
from datetime import datetime, timedelta
import json
from sqlalchemy.orm import joinedload


# only uncomment and use the below line during development mode. comment it when going to production
os.environ['FLASK_ENV'] = 'development'



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

#  integrityAI page
@app.route('/download-template')
def download_template():
    return send_file('static/img/PACT Compliance Assessment_v2.pdf', as_attachment=True)


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

@app.route("/aboutus")
def aboutus():
    return render_template("aboutus.html")

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

@app.route('/logout')
def logout():
    if 'user_id' in session:
        session.pop('user_id')
        flash('You have been logged out successfully.', 'success')
    else:
        flash('You are not logged in.', 'error')
    return redirect(url_for('login'))
















@app.route("/dashboard")
@admin_required
def dashboard():
    # Get year from query string, default to current year
    year = request.args.get('year', type=int)
    if not year:
        year = datetime.utcnow().year

    # Step 1: Group user signups by month for the selected year
    signups_by_month = db.session.query(
        extract('month', User.created_at).label('month'),
        func.count(User.id)
    ).filter(
        extract('year', User.created_at) == year
    ).group_by('month').order_by('month').all()

    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    signup_dict = OrderedDict((month, 0) for month in month_names)

    for month_num, count in signups_by_month:
        signup_dict[month_names[int(month_num) - 1]] = count

    months = list(signup_dict.keys())
    signups = list(signup_dict.values())

    # Step 2: Score level categorization (your existing logic)
    high = User.query.filter(User.score >= 50).count()
    medium = User.query.filter((User.score >= 30) & (User.score < 50)).count()
    low = User.query.filter((User.score < 30) & (User.score != None)).count()
    no_score = User.query.filter(User.score == None).count()

    score_counts = [high, medium, low, no_score]

    return render_template(
        'dashboard.html',
        months=months,
        signups=signups,
        score_counts=score_counts,
        selected_year=year
    )





@app.route('/dashboardDetail')
@admin_required
def dashboardDetail():
    # Fetch all users ordered by creation date descending
    users = User.query.options(joinedload(User.support_messages)).order_by(User.id.asc()).all()

    return render_template('dashboardDetail.html', users=users)















@app.route("/settings", methods=["GET", "POST"])
@login_required
def settings():
    user = User.query.get(session['user_id'])

    if request.method == "POST":
        action = request.form.get('action')

        if action == "update_username":
            new_username = request.form.get('new_username').strip()
            if new_username:
                existing = User.query.filter(User.name == new_username).first()
                if existing and existing.id != user.id:
                    flash("Username already taken.", "error")
                else:
                    user.name = new_username
                    db.session.commit()
                    flash("Username updated successfully!", "success")

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
            message_text = request.form.get('message').strip()

            if subject and message_text:
                new_message = SupportMessage(
                    user_id=user.id,
                    subject=subject,
                    message=message_text
                )
                db.session.add(new_message)
                db.session.commit()
                flash("Message sent successfully!", "success")
            else:
                flash("Please fill in both subject and message.", "error")

        elif action == "toggle_admin":
            if user.role != 'admin':
                flash("You are not authorized to perform this action.", "error")
                return redirect(url_for('settings'))

            user_id = request.form.get('user_id')
            target_user = User.query.get(user_id)

            if not target_user:
                flash("User not found.", "error")
            elif target_user.id == user.id:
                flash("You cannot change your own admin status.", "warning")
            else:
                if target_user.role == 'admin':
                    target_user.role = 'user'
                    flash(f"{target_user.name} has been demoted to user.", "success")
                else:
                    target_user.role = 'admin'
                    flash(f"{target_user.name} has been promoted to admin.", "success")
                db.session.commit()


        return redirect(url_for('settings'))
    
    # Pass all users to the template if current user is admin
    all_users = User.query.order_by(User.id).all() if user.role == 'admin' else []
    return render_template("settings.html", user=user, all_users=all_users)









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

            # Check if the user is an admin
            if user.role == 'admin':
                return redirect(url_for('dashboard'))
            else:
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