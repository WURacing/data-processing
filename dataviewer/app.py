import os
from csv import DictReader, DictWriter
from io import TextIOWrapper
from flask import Flask, render_template, request, send_file, url_for

from dataviewer.can import decode_csv

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.environ.get('UPLOAD_FOLDER', 'uploads')
app.config['CAN_FILE'] = "../VEHICLE.dbc"

@app.get('/')
def index():
    files = os.listdir(app.config['UPLOAD_FOLDER'])
    run_info = [{"name": f, "url": url_for("download_run", name=f)} for f in files]
    return render_template("home.html", runs=run_info)

@app.get('/upload')
def upload_page():
    return render_template("upload.html", title="Upload Run")

@app.get('/download/<name>')
def download_run(name: str):
    return send_file(os.path.join(app.config['UPLOAD_FOLDER'], name))

@app.post('/upload')
def upload_file():
    file = request.files.get('file')
    stream = TextIOWrapper(file, "UTF8", newline=None)
    reader = DictReader(stream)
    data, names = decode_csv(reader)

    path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    with open(path, 'w') as f:
        writer = DictWriter(f, fieldnames=names)
        writer.writeheader()
        for row in data:
            writer.writerow(row)

    return "File uploaded successfully"
    