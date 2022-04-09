from dotenv import load_dotenv
from flask import Flask

from dataviewer.config import Config
from dataviewer.views import server
from dataviewer.models import db


def create_app() -> Flask:

    load_dotenv()

    app = Flask(__name__)
    config = Config()
    app.config['config'] = config

    app.register_blueprint(server)
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_DATABASE_URI'] = config.database_uri
    db.init_app(app)

    return app
