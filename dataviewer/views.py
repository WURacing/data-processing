import datetime
from csv import DictReader, DictWriter
from io import BytesIO, StringIO, TextIOWrapper
from flask import Blueprint, render_template, request, send_file, url_for

from dataviewer.can import decode_csv, get_variables, required_messages
from dataviewer.config import get_config
from dataviewer.models import Run, Timeseries, db

server = Blueprint("server", __name__)


@server.get("/")
def index():
    runs = Run.query.all()
    run_info = [
        {
            "location": run.location,
            "date": run.datetime.strftime("%d %b %Y"),
            "time": run.datetime.strftime("%I:%M:%S %p"),
            "download_url": url_for("server.download_run", run_id=run.id),
            "filter_url": url_for("server.filter_run", run_id=run.id),
        }
        for run in runs
    ]
    return render_template("home.html", runs=run_info)


@server.get("/upload")
def upload_page():
    config = get_config()
    return render_template("upload.html", dbcs=config.list_dbcs(), title="Upload Run")


@server.get("/download/<int:run_id>")
def download_run(run_id: int):
    run = Run.by_id(run_id)
    data = Timeseries.query.filter_by(run_id=run_id).all()
    rows, names = decode_csv(run.dbc, data)

    buffer = StringIO()
    writer = DictWriter(buffer, fieldnames=names)
    writer.writeheader()
    for row in rows:
        writer.writerow(row)
    return send_file(
        BytesIO(buffer.getvalue().encode("utf-8")),
        mimetype="text/csv",
        download_name=f"{run.location}_{run.datetime.isoformat()}.csv",
    )


@server.post("/download/<int:run_id>/filter")
def download_run_filtered(run_id: int):

    run = Run.by_id(run_id)

    sensors = []
    for name, value in request.form.items():
        if value == "on":
            sensors.append(name)

    messages = required_messages(run.dbc, sensors)

    run = Run.by_id(run_id)
    data = (
        Timeseries.query.filter_by(run_id=run_id)
        .filter(Timeseries.msg_id.in_(messages))
        .all()
    )
    rows, names = decode_csv(run.dbc, data, signals=set(sensors))
    buffer = StringIO()
    writer = DictWriter(buffer, fieldnames=names)
    writer.writeheader()
    for row in rows:
        writer.writerow(row)
    return send_file(
        BytesIO(buffer.getvalue().encode("utf-8")),
        mimetype="text/csv",
        download_name=f"{run.location}_{run.datetime.isoformat()}.csv",
    )


@server.post("/upload")
def upload_file():
    file = request.files.get("file")

    location = request.form.get("location")
    date_str = request.form.get("date")
    time_str = request.form.get("time")
    dbc = request.form.get("dbc")

    dt = datetime.datetime.fromisoformat(f"{date_str} {time_str}")
    run = Run(location=location, datetime=dt, dbc=dbc)

    stream = TextIOWrapper(file, "UTF8", newline=None)
    reader = DictReader(stream)

    for row in reader:
        ts = Timeseries(
            timestamp=int(row["time"]), msg_id=int(row["id"], 16), data=row["data"]
        )
        run.data.append(ts)

    db.session.add(run)
    db.session.commit()

    return "File uploaded successfully"


@server.get("/filter/<int:run_id>")
def filter_run(run_id: int):
    run = Run.by_id(run_id)

    msg_ids = (
        Timeseries.query.filter_by(run_id=run_id)
        .with_entities(Timeseries.msg_id)
        .distinct()
        .all()
    )
    variables = get_variables(run.dbc, [entry[0] for entry in msg_ids])

    return render_template(
        "filter.html",
        run_location=run.location,
        run_datetime=run.datetime.strftime("%d %b %Y"),
        variables=variables,
        download_url=url_for("server.download_run_filtered", run_id=run_id),
    )
