from warehouse.client import get_snowflake_connection


def test_snowflake_connection():

    conn = get_snowflake_connection()

    if conn:
        print("✅ Snowflake connection test successful")
        conn.close()
        print("✅ Connection closed")


if __name__ == "__main__":
    test_snowflake_connection()