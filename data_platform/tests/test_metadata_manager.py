from manifests.metadata_manager import MetadataManager


def test_metadata_manager():

    manager = MetadataManager()

    manager.save_metadata(
        table_name="users_user",
        primary_key=["id"],
        watermark_column="updated_at",
        last_watermark="2026-06-04T01:00:00",
        rows_extracted=100,
        run_status="success",
    )

    metadata = manager.get_metadata("users_user")

    print(metadata)


if __name__ == "__main__":
    test_metadata_manager()