import datetime
from csv import DictReader, DictWriter
from io import BytesIO, StringIO, TextIOWrapper
from zipfile import ZipFile
from flask import Blueprint, render_template, request, send_file, url_for, Response
from werkzeug.datastructures import FileStorage

from dataviewer.can import decode_csv, get_variables, required_messages
from dataviewer.config import get_config
from dataviewer.models import Run, Timeseries, db

server = Blueprint("server", __name__)


@server.get("/")
def index():
    runs = Run.query.all()
    run_info = [
        {
            "id": run.id,
            "location": run.location,
            "name": run.name,
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
        download_name=f"{run.location}_{run.name}_{run.datetime.isoformat()}.csv",
    )


@server.post("/bulk-download")
def bulk_download():
    ids = []
    for name, value in request.form.items():
        if value == "on":
            ids.append(name)
    runs: list[Run] = Run.query.filter(Run.id.in_(ids)).all()

    stream = BytesIO()
    with ZipFile(stream, "w") as zf:

        for run in runs:
            print(
                "processing run",
                f"/{run.location}_{run.name}_{run.datetime.isoformat()}.csv",
            )
            data = Timeseries.query.filter_by(run_id=run.id).all()
            rows, names = decode_csv(run.dbc, data)

            buffer = StringIO()
            writer = DictWriter(buffer, fieldnames=names)
            writer.writeheader()
            for row in rows:
                writer.writerow(row)

            zf.writestr(
                f"/{run.location}_{run.name}_{run.datetime.isoformat()}.csv",
                buffer.getvalue(),
            )
        size = sum([zinfo.file_size for zinfo in zf.filelist])
        print(f"zip size: {size}")
    return Response(
        stream.getvalue(),
        mimetype="application/zip",
        headers={"Content-Disposition": "attachment;filename=runs.zip"},
    )


@server.get("/test")
def test():

    stream = BytesIO()
    with ZipFile(stream, "w") as zf:
        for dbc in get_config().list_dbcs():
            dbc_path = get_config().dbc_path(dbc)
            zf.write(dbc_path, f"/{dbc}")
    return Response(
        stream.getvalue(),
        mimetype="application/zip",
        headers={"Content-Disposition": "attachment;filename=your_filename.zip"},
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
    files = request.files.getlist("file")
    location = request.form.get("location")
    dbc = request.form.get("dbc")

    results = []

    for file in files:
        try:
            upload_data(file, location, dbc)
            results.append({"name": file.filename, "success": True})
        except Exception as e:
            results.append({"success": False, "name": file.filename, "message": str(e)})

    return render_template("upload_result.html", files=results)


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
        run_name=run.name,
        run_datetime=run.datetime.strftime("%d %b %Y"),
        variables=variables,
        download_url=url_for("server.download_run_filtered", run_id=run_id),
    )


def upload_data(file: FileStorage, location: str, dbc: str):
    date_str = request.form.get(f"run-date-{file.filename}")
    time_str = request.form.get(f"run-time-{file.filename}")
    name = request.form.get(f"run-name-{file.filename}")

    dt = datetime.datetime.fromisoformat(f"{date_str} {time_str}")
    run = Run(location=location, name=name, datetime=dt, dbc=dbc)

    stream = TextIOWrapper(file, "UTF8", newline=None)
    reader = DictReader(stream)

    for row in reader:
        ts = Timeseries(
            timestamp=int(row["time"]), msg_id=int(row["id"], 16), data=row["data"]
        )
        run.data.append(ts)

    db.session.add(run)
    db.session.commit()
