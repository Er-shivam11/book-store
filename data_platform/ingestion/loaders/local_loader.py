import json
from pathlib import Path
from datetime import datetime


class LocalLoader:
    """
    Simulates RAW S3 layer using local filesystem.
    """

    def __init__(self, base_path="ingestion/storage/raw"):
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)

    def load_to_raw(self, table_name, data: list):

        if not data:
            print(f"⚠️ No data to load for {table_name}")
            return

        date_str = datetime.now().strftime("%Y-%m-%d")

        table_path = self.base_path / table_name
        table_path.mkdir(parents=True, exist_ok=True)

        file_path = table_path / f"{date_str}.json"

        with open(file_path, "w") as f:
            json.dump(data, f, indent=4, default=str)

        print(f"✅ Loaded {len(data)} records to RAW: {file_path}")