# data_platform/scripts/run_snowflake_loader.py
from warehouse.loaders.snowflake_loader import SnowflakeLoader
import os
from pathlib import Path


def get_latest_file():

    base_path = Path("ingestion/storage/raw/users_user")

    files = sorted(base_path.glob("*.json"))

    if not files:
        raise Exception("No raw files found")

    return str(files[-1])   # latest file


def test_snowflake_load():

    latest_file = get_latest_file()

    print(f"📌 Loading file: {latest_file}")

    loader = SnowflakeLoader()
    loader.setup_infrastructure()
    loader.upload_to_stage(latest_file)
    loader.copy_into_raw_table()

    loader.close()


if __name__ == "__main__":
    test_snowflake_load()