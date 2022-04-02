# Dataviewer

A minimum viable dataviewer application. Supports

 - Uploading raw CSV files from the car.
 - Uses DBC files to decode data into a readable CSV format.
 - Viewing the list of avaible run data.
 - Download run data in CSV format.


## Getting Started

### Dependencies
If you don't already have it, install [Poetry](https://github.com/python-poetry/poetry).

Then, to install the dependencies for this project, run 

```
poetry install
```

### Running the Server
```
cd dataviewer
export FLASK_DEBUG=true
flask run
```