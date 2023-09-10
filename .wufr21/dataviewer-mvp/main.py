import waitress
from dataviewer.app import create_app
from dataviewer.models import db


app = create_app()

with app.app_context():
    db.create_all()

waitress.serve(app, host="127.0.0.1", port=5000)
