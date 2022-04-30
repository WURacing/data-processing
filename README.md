# Dataviewer

A minimum viable dataviewer application. Supports

 - Uploading raw CSV files from the car.
 - Uses DBC files to decode data into a readable CSV format.
 - Viewing the list of avaible run data.
 - Download run data in CSV format.
 - Choosing a subset of variables on a run to download.


## Getting Started

### Dependencies
If you don't already have it, install [Poetry](https://github.com/python-poetry/poetry).

Then, to install the dependencies for this project, run 

```
poetry install
```

### Database

Run `python main.py`. This will create all of the required database models if they don't exist. If this script runs successfully, the dataviewer will be available at `http://127.0.0.1:5000`. 


## Running the Server

### Development
```
cd dataviewer
export FLASK_DEBUG=true
flask run
```

## Production

To run the server in production mode, from the root of the repository, run:
```bash
python main.py
```
