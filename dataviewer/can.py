from csv import DictReader
from cantools.database import load_file

from dataviewer.config import get_config

EXTENDED_MASK = 0x1FFFFFFF

def decode_csv(reader: DictReader) -> tuple[list[dict[str, float | str]], list[str]]:
    config = get_config()
    dbc = load_file(config.can_file)

    field_names = set()
    messages = []
    
    for row in reader:
        id = int(row['id'], 16) & EXTENDED_MASK
        data = bytes.fromhex(row['data'])
        time = int(row['time'])

        message = dbc.decode_message(id, data)
        field_names |= set(message.keys())
        message['time'] = time
        messages.append(message)
    return messages, ['time'] + list(field_names)
