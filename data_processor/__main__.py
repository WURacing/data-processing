from bottle import Bottle, run, get, post, request, response
import toml
import boto3
import datetime
import re
from pathlib import Path
import mysql.connector
import canparser
from data_processor import LOG
from data_processor.errors import ERR_DBC_NOT_FOUND, ERR_BAD_FILE, ERR_BAD_DATA, ERR_UNSPECIFIED
from data_processor.config_handler import ConfigHandler
import codecs
import io
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

AWS_SESSION = boto3.session.Session(CONFIG['config']['aws_access_key'],
                                    CONFIG['config']['aws_secret_key'],
                                    region_name='ca-central-1')

app = Bottle()


@app.get('/')
def log():
    return 'welcome to data processor'


@app.get('/doc')
def doc():
    return 'placeholder route for API documentation and error documentation'


@app.post('/process/files/<dbc_version>/<location>')
def process_files(dbc_version, location):
    """
    Process one or more files given an associated DBC version
    Arguments:
        it is assumed data will arrive in a series of files with the following parameters:
        NAME: /RUN\d{4}.CSV/i
        CONTENTS: One (1) header row with the following pattern
        timestamp (unix), PACKET_NAME, PACKET_DATA
    Response:
        200 OK - DBC exists, files were succesfully uploaded to Blob Storage and DB
        500 Internal Server Error -
            E001 - DBC Not Found
                The specified DBC version could not be pulled from Git
            E002 - Bad File
                One of the files provided failed to conform to the appropriate naming schema
            E003 - Bad Data
                One of the files provided contained an incorrect column count
            E999 - Unspecified
                For an unknown reason, the server was unable to process your request
    """
    # TODO move ^ to documentation

    dbc_handler = ConfigHandler('/config_cache')

    # if can't get dbc from git or cache, error
    if not dbc_handler.dbc_version_exists(dbc_version):
        response.status_code = 500
        response.body = ERR_DBC_NOT_FOUND.formatted_error()
        return response

    # prepare to process files
    log = ''
    files = request.files
    s3 = AWS_SESSION.client('s3')
    now = datetime.datetime.now()

    mysql_conn = mysql.connector.connect(
        user=CONFIG['config']['mysql_usr'],
        password=CONFIG['config']['mysql_pwd'],
        host=CONFIG['config']['mysql_host'],
        database=CONFIG['config']['mysql_db'])

    cursor = mysql_conn.cursor()

    for run_file in files:
        log += f'processing {run_file}\n'

        # ensure file matches naming schema
        name_match = re.match(r"LOG\d{4}.CSV$", run_file, re.IGNORECASE)
        log += f'{run_file} conforms to naming schema\n'
        if not name_match:
            # bad file name, exit
            response.status = 500
            response.body = ERR_BAD_FILE.formatted_error_with_context(log)
            return response

        data = files[run_file].file.read()

        # try to upload file to s3
        log += f'uploading {run_file} as {now.year}{now.month}{now.day}-{dbc_version}-{run_file.upper()}\n'
        try:
            s3.put_object(
                Body=data,
                Bucket=DEST_BUCKET,
                Key=
                f'{now.year}{now.month}{now.day}-{dbc_version}-{run_file.upper()}\n'
            )
        except Exception as e:
            # upload failed, exit
            response.status = 500
            response.body = ERR_UNSPECIFIED.formatted_error_with_context(
                f'{log}\n{e}')
            return response
        log += f'file uploaded\n'

        # create run in MySQL

        add_run = ('INSERT INTO runs'
                   '(session_index, dbc_version, loc)'
                   'VALUES (%s, %s, %s)')

        cursor.execute(add_run, (int(run_file[3:7]), dbc_version, location))

        run_id = cursor.lastrowid

        add_signal = (
            'INSERT INTO readings'
            '(run, log_time, packet_name, sig_name, sig_value, sig_unit)'
            'VALUES (%s, %s, %s, %s, %s, %s)')

        parser = canparser.BytesCANParser(dbc_handler.dbc_path(dbc_version),
                                          str(data))

        up_fire_id = ('RIGHT_CAN_CONTROLLER', 'RightController0',
                      'CGAccUpFirewall')
        from_fire_id = ('RIGHT_CAN_CONTROLLER', 'RightController0',
                        'CGAccFromFirewall')
        neg_x_id = ('Filter', 'Filter', 'CGAccNegX', 'acceleration:G')
        neg_z_id = ('Filter', 'Filter', 'CGAccNegZ', 'acceleration:G')
        x_id = ('Filter', 'Filter', 'CGAccX', 'acceleration:G')
        z_id = ('Filter', 'Filter', 'CGAccZ', 'acceleration:G')

        load_id = ('AEM_EMS_4', 'AEMEngine0', 'EngineLoad')
        map_id = ('Filter', 'Filter', 'ManifoldPressure', 'pressure:kpa')

        rotate_acc = canparser.Rotate2DFilter(
            input_signals=[from_fire_id, up_fire_id],
            output_signals=[neg_x_id, neg_z_id],
            theta=-0.92)
        flip_x = canparser.LinearComboFilter(input_signals=[neg_x_id[:-1]],
                                             output_signal=x_id,
                                             coeffs=[-1, 0])
        flip_z = canparser.LinearComboFilter(input_signals=[neg_z_id[:-1]],
                                             output_signal=z_id,
                                             coeffs=[-1, 0])
        scale_load = canparser.LinearComboFilter(input_signals=[load_id],
                                                 output_signal=map_id,
                                                 coeffs=[1.1489, 0])

        pfiltered = canparser.ParserFilter(
            signal_filters=[rotate_acc, flip_z, flip_x, scale_load],
            parser=parser)

        for signal in pfiltered.filtered_signals():
            cursor.execute(
                add_signal,
                (run_id, signal['timestamp'], signal['msg_name'],
                 signal['sig_name'], signal['sig_val'], signal['units']))

    mysql_conn.commit()
    mysql_conn.close()

    response.status = 200
    response.body = log
    return response


@app.post('/process/packets/<dbc_version>')
def process_packets(dbc_version):
    """
        Processes individual CAN Packets
    """
    return 'WIP'


run(app, host='127.0.0.1', port=PORT)