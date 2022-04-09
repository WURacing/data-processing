import os
from csv import DictReader, DictWriter
from io import TextIOWrapper
from flask import Blueprint, render_template, request, send_file, url_for

from dataviewer.can import decode_csv
from dataviewer.config import get_config
from dataviewer.models import Run


server = Blueprint('server', __name__)


@server.get('/')
def index():
    config = get_config()
    files = os.listdir(config.upload_folder)
    run_info = [{"name": f, "url": url_for("server.download_run", name=f)} for f in files]
    return render_template("home.html", runs=run_info)

@server.get('/upload')
def upload_page():
    return render_template("upload.html", title="Upload Run")

@server.get('/download/<name>')
def download_run(name: str):
    config = get_config()
    return send_file(os.path.join(config.upload_folder, name))

@server.post('/upload')
def upload_file():
    config = get_config()
    file = request.files.get('file')
    stream = TextIOWrapper(file, "UTF8", newline=None)
    reader = DictReader(stream)
    data, names = decode_csv(reader)

    path = os.path.join(config.upload_folder, file.filename)
    with open(path, 'w') as f:
        writer = DictWriter(f, fieldnames=names)
        writer.writeheader()
        for row in data:
            writer.writerow(row)

    return "File uploaded successfully"

@server.get('/runs')
def runs():
    return str(Run.query.all())
    