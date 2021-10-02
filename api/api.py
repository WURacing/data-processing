import time
import csv
import json
import tempfile
from flask import Flask,flash,redirect,jsonify, make_response, request, send_file
from werkzeug.utils import secure_filename
from pathlib import Path


app = Flask(__name__)

@app.route('/time')
def get_current_time():
    return{'time' :time.time()}


@app.route('/csv', methods=['POST'])
def returnCSVFile():
    req = request.get_json()
    csv_file = open("./Data/data.csv", 'w', newline='')
    f = csv.writer(csv_file)
    for entry in req:
        if entry != []:
            f.writerow(entry)
    csv_file.close()
    res = make_response(send_file(csv_file.name), 200)
    return res

@app.route('/json', methods=['POST'])
def returnJSONFile():
    req = request.get_json()
    json_string = json.dumps(req)
    json_file = open("./Data/data.json", "w")
    json_file.write(json_string)
    json_file.close()
    res = make_response(send_file(json_file.name), 200)
    return res


def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'csv', 'json'}
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/import', methods=['POST'])
def returnParsedFile():
    if request.method == 'POST':
        if 'file' not in request.files:
            return make_response('file not in request', 200)
        file = request.files['file']
        content = request.files['file'].content_type
        print("content: " + content) 
        if file.filename == '':
            return make_response ('blank file name', 200)
        if file and allowed_file(file.filename):
            with tempfile.TemporaryDirectory() as tmp_dir_name:
                tmp_file_name = tmp_dir_name + '/' + file.filename
                file.save(tmp_file_name)
                if content == "text/csv":
                    results = []
                    csv_file = open(tmp_file_name, newline='')
                    csv_reader = csv.reader(csv_file)
                    for line in csv_reader:
                        results.append(line)
                    return make_response(jsonify(results), 200)
                else:
                    with open(tmp_file_name) as f:
                        data = list(json.load(f))
                    return make_response(jsonify(data), 200)
        else:
            return make_response('not allowed file type', 200)
    return make_response("not post method", 400)
