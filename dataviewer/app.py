from dotenv import load_dotenv
from flask import Flask

def create_app() -> Flask:

    load_dotenv()

    from dataviewer.config import Config
    config = Config()

    app = Flask(__name__)
    
    app.config["config"] = config
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SQLALCHEMY_DATABASE_URI"] = config.database_uri

    register_blueprints(app)
    register_extensions(app)

    return app


def register_blueprints(app: Flask):
    from dataviewer.views import server

    app.register_blueprint(server)


def register_extensions(app: Flask):
    from dataviewer.models import db

    db.init_app(app)
