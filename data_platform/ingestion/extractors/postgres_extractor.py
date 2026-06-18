from utils.postgres_connection import get_postgres_connection
from utils.yaml_reader import read_yaml


class PostgresExtractor:
    """
    Simple full-load extractor (NO CDC yet).
    Metadata-driven column selection.
    """

    def __init__(self, config_file):
        self.config = read_yaml(config_file)
        self.table = self.config["object_name"]
        self.schema = self.config["object_schema"]
        self.columns_config = self.config["columns"]

    def extract_full_data(self):

        conn = get_postgres_connection()
        cursor = conn.cursor()

        # ✅ Build column list from YAML (NO SELECT *)
        column_names = [
            col["column_name"] for col in self.columns_config
        ]

        column_sql = ", ".join(column_names)

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

        return result