from bottle import Bottle, run, get, post, request
import toml
from pathlib import Path
from data_processor import LOG

# globals
PORT = None
DEST_BUCKET = 'archive.wuracing.com'
CONFIG_PATH = f'{Path(__file__).parent}/../agent_config.toml'
CONFIG = None

try:
    CONFIG = toml.load(CONFIG_PATH)
    PORT = CONFIG['deployment']['dest']
except FileNotFoundError:
    LOG.error(f'count not find file with path {CONFIG_PATH}')
    raise SystemExit

if PORT is None or CONFIG is None:
    raise SystemExit('Failed to load required resources from agent_config')

app = Bottle()

@app.get('/')
def log():
    return 'welcome to data processor'

@app.post('/recieve')
def recieve():
    files = request.files
    # upload each file to S3
    for f in files:
        pass
    # process files and upload to sql
    for f in files:
        pass
    print(files)

run(app, host='localhost', port=PORT)