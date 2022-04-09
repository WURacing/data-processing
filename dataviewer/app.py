from flask import Flask

from dataviewer.config import Config
from dataviewer.views import server


def create_app() -> Flask:
    app = Flask(__name__)
    app.config['config'] = Config()

    app.register_blueprint(server)

    return app
