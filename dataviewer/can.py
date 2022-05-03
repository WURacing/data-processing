from cantools.database import load_file

from dataviewer.config import get_config
from dataviewer.models import Timeseries

EXTENDED_MASK = 0x1FFFFFFF


def decode_csv(
    dbc_name: str,
    rows: list[Timeseries],
    signals: set[str] = None,
) -> tuple[list[dict[str, float | str]], list[str]]:
    config = get_config()
    dbc = load_file(config.dbc_path(dbc_name))

    field_names = set()
    messages = []

    for row in rows:
        id = row.msg_id & EXTENDED_MASK
        data = bytes.fromhex(row.data)
        time = row.timestamp

        message = dbc.decode_message(id, data)

        if signals is not None:
            surviving_keys = set(message.keys()) & signals
            message = {k: message[k] for k in surviving_keys}

        field_names |= set(message.keys())
        message["time"] = time
        messages.append(message)
    return messages, ["time"] + list(field_names)


def get_variables(dbc_name: str, active_messages: list[int]) -> list[tuple[str, bool]]:
    config = get_config()
    dbc = load_file(config.dbc_path(dbc_name))
    signals = []
    for msg in dbc.messages:
        for signal in msg.signals:
            signals.append((signal.name, msg.frame_id in active_messages))

    return signals


def required_messages(dbc_name: str, sensors: list[str]):
    config = get_config()
    dbc = load_file(config.dbc_path(dbc_name))
    messages = set()

    for msg in dbc.messages:
        for signal in msg.signals:
            if signal.name in sensors:
                messages.add(msg.frame_id)

    return messages
