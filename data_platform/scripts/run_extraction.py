from ingestion.extractors.postgres_extractor import PostgresExtractor


def test_extract():

    extractor = PostgresExtractor("users_user.yml")

    data = extractor.extract_full_data()

    print(data[:2])


if __name__ == "__main__":
    test_extract()