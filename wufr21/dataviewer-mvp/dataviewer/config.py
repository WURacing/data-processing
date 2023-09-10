import os
from dataclasses import dataclass

from flask import current_app


@dataclass(frozen=True)
class Config:
    """Configuration for the data viewer."""

    dbc_dir: str = os.environ.get("DBC_DIR", "dbc/")
    port: str = os.environ.get("DATABASE_PORT", "5432")
    dialect: str = os.environ.get("DATABASE_DIALECT", "postgresql")
    driver: str = os.environ.get("DATABASE_DRIVER", "psycopg2")
    database: str = os.environ.get("DATABASE_NAME", "washuracing")
    username: str = os.environ["DATABASE_USER"]
    password: str = os.environ["DATABASE_PASSWORD"]
    host: str = os.environ.get("DATABASE_HOST", "localhost")

    @property
    def database_uri(self) -> str:
        return "{dialect}+{driver}://{username}:{password}@{host}:{port}/{database}".format(
            dialect=self.dialect,
            driver=self.driver,
            username=self.username,
            password=self.password,
            host=self.host,
            port=self.port,
            database=self.database,
        )

    def list_dbcs(self) -> list[str]:
        return os.listdir(self.dbc_dir)

    def dbc_path(self, dbc_name: str) -> str:
        return os.path.join(self.dbc_dir, dbc_name)


def get_config() -> Config:
    """Get the configuration for the data viewer."""
    return current_app.config["config"]
