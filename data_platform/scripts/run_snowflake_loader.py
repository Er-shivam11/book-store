from warehouse.loaders.snowflake_loader import SnowflakeLoader


def test_snowflake_load():

    loader = SnowflakeLoader()

    loader.upload_to_stage(
        "ingestion/storage/raw/users_user/2026-06-04.json"
    )

    loader.copy_into_raw_table()

    loader.close()


if __name__ == "__main__":
    test_snowflake_load()