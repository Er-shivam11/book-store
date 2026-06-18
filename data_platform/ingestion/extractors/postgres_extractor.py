from utils.postgres_connection import get_postgres_connection
from utils.yaml_reader import read_yaml
import json
import os
from datetime import datetime


class PostgresExtractor:
    """
    CDC-enabled extractor using updated_at watermark
    + writes JSON to raw storage
    """

    def __init__(self, config_file, manifest_file):
        self.config = read_yaml(config_file)

        self.table = self.config["object_name"]
        self.schema = self.config["object_schema"]
        self.columns_config = self.config["columns"]

        self.manifest_file = manifest_file
        self.manifest = self._load_manifest()

        self.watermark_column = self.manifest.get("watermark_column", "updated_at")
        self.last_watermark = self.manifest.get("last_watermark")

    # -----------------------------
    # Load manifest
    # -----------------------------
    def _load_manifest(self):
        if os.path.exists(self.manifest_file):
            with open(self.manifest_file, "r") as f:
                return json.load(f)
        return {}

    # -----------------------------
    # Save manifest
    # -----------------------------
    def _save_manifest(self):
        with open(self.manifest_file, "w") as f:
            json.dump(self.manifest, f, indent=4, default=str)

    # -----------------------------
    # Extract CDC data
    # -----------------------------
    def extract_data(self):

        conn = get_postgres_connection()
        cursor = conn.cursor()

        # column selection from YAML
        column_names = [col["column_name"] for col in self.columns_config]
        column_sql = ", ".join(column_names)

        # -----------------------------
        # CDC FILTER LOGIC
        # -----------------------------
        if self.last_watermark:
            query = f"""
            SELECT {column_sql}
            FROM {self.schema}.{self.table}
            WHERE {self.watermark_column} > %s
            """
            cursor.execute(query, (self.last_watermark,))
        else:
            query = f"""
            SELECT {column_sql}
            FROM {self.schema}.{self.table}
            """
            cursor.execute(query)

        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]

        result = [dict(zip(columns, row)) for row in rows]

        cursor.close()
        conn.close()

        print(f"✅ Extracted {len(result)} rows from {self.table}")

        # -----------------------------
        # WRITE RAW JSON FILE
        # -----------------------------
        self._write_raw_file(result)

        # -----------------------------
        # UPDATE MANIFEST WATERMARK
        # -----------------------------
        self._update_manifest(result)

        return result

    # -----------------------------
    # Write JSON file
    # -----------------------------
    def _write_raw_file(self, data):

        today = datetime.now().strftime("%Y-%m-%d")

        output_dir = f"ingestion/storage/raw/{self.table}"
        os.makedirs(output_dir, exist_ok=True)

        file_path = f"{output_dir}/{today}.json"

        with open(file_path, "w") as f:
            json.dump(data, f, indent=4, default=str)

        print(f"📁 Raw file written: {file_path}")

    # -----------------------------
    # Update watermark
    # -----------------------------
    def _update_manifest(self, data):

        if not data:
            print("ℹ️ No new rows → watermark not updated")
            return

        # get latest updated_at from batch
        latest = max(row[self.watermark_column] for row in data)

        self.manifest["last_watermark"] = str(latest)
        self.manifest["rows_extracted"] = len(data)
        self.manifest["run_status"] = "success"

        self._save_manifest()

        print(f"🔄 Watermark updated → {latest}")