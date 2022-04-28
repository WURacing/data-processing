from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class Run(db.Model):
    __tablename__ = "runs"

    id = db.Column(db.Integer, primary_key=True)
    location = db.Column(db.String(255))
    dbc = db.Column(db.String(32), nullable=False)
    datetime = db.Column(db.DateTime, nullable=False)


class Timeseries(db.Model):
    __tablename__ = "timeseries"

    id = db.Column(db.Integer, primary_key=True)
    run_id = db.Column(db.Integer, db.ForeignKey("runs.id"), nullable=False)
    run = db.relationship("Run", backref=db.backref("data", lazy=True))
    timestamp = db.Column(db.Integer, nullable=False)
    msg_id = db.Column(db.Integer, nullable=False)
    data = db.Column(db.String(16), nullable=False)
