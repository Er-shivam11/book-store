from pathlib import Path

from warehouse.client import get_snowflake_connection


class SnowflakeLoader:
    """
    Loads local JSON files into Snowflake RAW layer.
    """

    def __init__(self):
        self.conn = get_snowflake_connection()

    def setup_infrastructure(self):

        cursor = self.conn.cursor()
    
        sql_files = [
            "warehouse/ddl/create_database.sql",
            "warehouse/ddl/create_schema.sql",
            "warehouse/stages/create_internal_stage.sql",
            "warehouse/ddl/raw_users_user.sql"
        ]
    
        for sql_file in sql_files:
        
            print(f"📌 Executing {sql_file}")
    
            with open(sql_file, "r") as f:
                sql_commands = f.read().split(";")
    
            for command in sql_commands:
            
                command = command.strip()
    
                if command:
                    cursor.execute(command)
    
            print(f"✅ Executed {sql_file}")
    
        cursor.close()
        print("✅ Snowflake infrastructure ready")

    def upload_to_stage(
        self,
        file_path,
        stage_name="RAW_STAGE",
    ):
        """
        Upload local file to Snowflake stage.
        """

        cursor = self.conn.cursor()

        put_query = f"""
        PUT file://{Path(file_path).absolute()}
        @{stage_name}
        OVERWRITE = TRUE
        AUTO_COMPRESS = FALSE
        """

        cursor.execute(put_query)

        print(f"✅ File uploaded to stage: {stage_name}")

        cursor.close()

    def copy_into_raw_table(
        self,
        table_name="USERS_USER",
        stage_name="RAW_STAGE",
    ):
        """
        Load JSON from stage into RAW table.
        """

        cursor = self.conn.cursor()

        copy_query = f"""
        COPY INTO {table_name}(RAW_DATA)
        FROM (
            SELECT PARSE_JSON($1)
            FROM @{stage_name}
        )
        FILE_FORMAT = (
            TYPE = JSON
        )
        """

        cursor.execute(copy_query)

        print(f"✅ Data loaded into RAW.{table_name}")

        cursor.close()

    def close(self):

        if self.conn:
            self.conn.close()
            print("✅ Snowflake connection closed")