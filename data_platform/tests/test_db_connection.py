from utils.postgres_connection import get_postgres_connection


def test_postgres_connection():

    conn = get_postgres_connection()

    if conn:
        print("✅ Connection test successful")
        conn.close()
        print("✅ Connection closed")


if __name__ == "__main__":
    test_postgres_connection()