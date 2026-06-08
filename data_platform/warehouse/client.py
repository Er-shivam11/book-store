import os

import snowflake.connector
from dotenv import load_dotenv

load_dotenv()


def get_snowflake_connection():

    try:
        conn = snowflake.connector.connect(
            user=os.getenv("SNOWFLAKE_USER"),
            password=os.getenv("SNOWFLAKE_PASSWORD"),
            account=os.getenv("SNOWFLAKE_ACCOUNT"),
            warehouse=os.getenv("SNOWFLAKE_WAREHOUSE"),
            database=os.getenv("SNOWFLAKE_DATABASE"),
        )

        print("✅ Snowflake connection established")

        return conn

    except Exception as e:
        print(f"❌ Snowflake connection failed: {e}")
        raise