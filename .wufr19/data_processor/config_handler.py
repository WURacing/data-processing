import os
import requests


class ConfigHandler():
    def __init__(self, folder='./config_cache'):
        self.config_folder = folder

    def dbc_version_exists(self, dbc_version):
        if os.path.isfile(f'{self.config_folder}/{dbc_version}.dbc'):
            return True
        else:
            # dbc is not in cache, request from git
            res = requests.get(
                f'https://raw.githubusercontent.com/WURacing/DBC/master/dbc/{dbc_version}.dbc'
            )
            if res.status_code == 404:
                return False
            else:
                with open(
                        f'data_processor/{self.config_folder}/{dbc_version}.dbc',
                        'wb') as f:
                    f.write(res.content)
                return True

    def dbc_path(self, dbc_version):
        return f'data_processor/{self.config_folder}/{dbc_version}.dbc'