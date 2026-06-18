from ingestion.extractors.postgres_extractor import PostgresExtractor
import os


def test_extract():

    base_dir = os.path.dirname(os.path.dirname(__file__))

    config_path = os.path.join(
        base_dir,
        "ingestion",
        "config",
        "users_user.yml"
    )

    manifest_path = os.path.join(
        base_dir,
        "ingestion",
        "manifests",
        "users_user.json"
    )

    extractor = PostgresExtractor(
        config_file=config_path,
        manifest_file=manifest_path
    )

    data = extractor.extract_data()
    print(data)


if __name__ == "__main__":
    test_extract()