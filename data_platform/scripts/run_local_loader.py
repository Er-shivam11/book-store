from ingestion.extractors.postgres_extractor import PostgresExtractor
from ingestion.loaders.local_loader import LocalLoader


def test_pipeline():

    extractor = PostgresExtractor("users_user.yml")
    data = extractor.extract_full_data()

    loader = LocalLoader()
    loader.load_to_raw("users_user", data)


if __name__ == "__main__":
    test_pipeline()