from csv import DictReader
from cantools.database import load_file

from dataviewer.config import get_config
from dataviewer.models import Timeseries

EXTENDED_MASK = 0x1FFFFFFF


def decode_csv(
    rows: list[Timeseries],
) -> tuple[list[dict[str, float | str]], list[str]]:
    config = get_config()
    dbc = load_file(config.can_file)

    field_names = set()
    messages = []

    for row in rows:
        id = row.msg_id & EXTENDED_MASK
        data = bytes.fromhex(row.data)
        time = row.timestamp

        message = dbc.decode_message(id, data)
        field_names |= set(message.keys())
        message["time"] = time
        messages.append(message)
    return messages, ["time"] + list(field_names)
