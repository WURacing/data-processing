import os
from dataclasses import dataclass

from flask import current_app


@dataclass(frozen=True)
class Config:
    """Configuration for the data viewer."""
    upload_folder: str = os.environ.get('UPLOAD_FOLDER', 'uploads')
    can_file: str = os.environ.get('CAN_FILE', '../VEHICLE.dbc')



def get_config() -> Config:
    """Get the configuration for the data viewer."""
    return current_app.config['config']