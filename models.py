from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date, time
import json


db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    role = db.Column(db.String(20), default='employee')  
    score = db.Column(db.Integer, default=None)
    remark = db.Column(db.Text, default=None)  
    created_at = db.Column(db.DateTime, default=datetime.now)  
    
    def __repr__(self):
        return f'<User {self.name}>'
    
    def is_admin(self):
        return self.role == 'admin'
    
    def is_manager(self):
        return self.role == 'manager'
    
    def is_employee(self):
        return self.role == 'employee'



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


















class PactAssessment(db.Model):
    __tablename__ = 'pact_assessments'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    organization_name = db.Column(db.String(255), nullable=False)
    assessor_name = db.Column(db.String(255), nullable=False)
    review_date = db.Column(db.Date, nullable=False)
    assessment_data = db.Column(db.Text, nullable=False)  # Stored as JSON string
    total_score = db.Column(db.Integer, default=0)
    percentage_score = db.Column(db.Float, default=0.0)
    status = db.Column(db.String(50), default='draft')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def set_assessment_data(self, data):
        self.assessment_data = json.dumps(data)
        self._calculate_scores(data)

    def _calculate_scores(self, data):
        total = 0
        count = 0

        for section_key, items in data.get('assessments', {}).items():
            for item_key, item_data in items.items():
                try:
                    score = int(item_data.get('score'))
                    total += score
                    count += 1
                except (ValueError, TypeError):
                    # Skip invalid or missing scores
                    continue

        self.total_score = total
        self.percentage_score = (total / (count * 4)) * 100 if count > 0 else 0

    def get_section_scores(self):
        try:
            data = json.loads(self.assessment_data or "{}")
        except json.JSONDecodeError:
            return {}

        section_scores = {}
        for section_key, items in data.get('assessments', {}).items():
            section_total = 0
            item_count = 0

            for item_key, item_data in items.items():
                try:
                    score = int(item_data.get('score'))
                    section_total += score
                    item_count += 1
                except (ValueError, TypeError):
                    continue

            section_scores[section_key] = {
                'score': section_total,
                'percentage': round((section_total / (item_count * 4)) * 100, 1) if item_count > 0 else 0
            }

        return section_scores

    def __repr__(self):
        return f'<PactAssessment {self.id} - {self.organization_name}>'

























class QuizResult(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    score = db.Column(db.Integer, nullable=False)
    max_score = db.Column(db.Integer, nullable=False)
    taken_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    user = db.relationship('User', backref='quiz_results')
    
    def __repr__(self):
        return f'<QuizResult User:{self.user_id} Score:{self.score}/{self.max_score}>'  
