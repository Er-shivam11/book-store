# data_platform/utils/postgres_connection.py
import os

import psycopg2
from dotenv import load_dotenv

load_dotenv()


def get_postgres_connection():
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("POSTGRES_DB"),
            user=os.getenv("POSTGRES_USER"),
            password=os.getenv("POSTGRES_PASSWORD"),
            host=os.getenv("POSTGRES_HOST"),
            port=os.getenv("POSTGRES_PORT"),
        )

        print("✅ PostgreSQL connection established")
        return conn

    except Exception as e:
        print(f"❌ PostgreSQL connection failed: {e}")
        raise