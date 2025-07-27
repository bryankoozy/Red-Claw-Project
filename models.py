from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date, time


db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='user')
    score = db.Column(db.Integer, default=None)
    remark = db.Column(db.Text, default=None)  
    created_at = db.Column(db.DateTime, default=datetime.now)  
    
    def __repr__(self):
        return f'<User {self.name}>'



class SupportMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    subject = db.Column(db.String(200), nullable=False)
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now)

    user = db.relationship('User', backref='support_messages')




# ADD THIS NEW MODEL
class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Appointment details
    appointment_date = db.Column(db.Date, nullable=False)
    appointment_time = db.Column(db.Time, nullable=False)
    subject = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    
    # Contact information
    phone_number = db.Column(db.String(20), nullable=False)
    
    # Status tracking
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, cancelled, completed
    
    # Organization info
    organization = db.Column(db.String(100), default='CPIB')
    
    # Admin remarks
    admin_remarks = db.Column(db.Text, nullable=True)
    
    # Timestamps
    created_at = db.Column(db.DateTime, default=datetime.now)
    updated_at = db.Column(db.DateTime, default=datetime.now, onupdate=datetime.now)
    
    # Relationship
    user = db.relationship('User', backref='appointments')
    
    def __repr__(self):
        return f'<Appointment {self.id} - {self.user.name} on {self.appointment_date}>'
