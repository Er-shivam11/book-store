import os
from dotenv import load_dotenv
import snowflake.connector

load_dotenv()  # Load .env

def get_snowflake_connection():
    try:
        conn = snowflake.connector.connect(
            user=os.getenv("SNOWFLAKE_USER"),
            password=os.getenv("SNOWFLAKE_PASSWORD"),
            account=os.getenv("SNOWFLAKE_ACCOUNT"),
            warehouse=os.getenv("SNOWFLAKE_WAREHOUSE"),
            database=os.getenv("SNOWFLAKE_DATABASE"),
            schema=os.getenv("SNOWFLAKE_SCHEMA"),
            role=os.getenv("SNOWFLAKE_ROLE")
        )
        cursor = conn.cursor()

        user = cursor.execute("SELECT CURRENT_USER()").fetchone()[0]
        role = cursor.execute("SELECT CURRENT_ROLE()").fetchone()[0]
        wh = os.getenv("SNOWFLAKE_WAREHOUSE")

        print(f"✅ Connected to Snowflake -> USER={user}, ROLE={role}, WAREHOUSE={wh}")

        return conn, cursor

    except Exception as e:
        print(f"❌ Snowflake connection failed: {e}")
        raise e
