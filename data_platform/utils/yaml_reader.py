import yaml
from pathlib import Path


def read_yaml(file_name: str, config_dir="ingestion/config"):
    """
    Reads YAML config and returns Python dictionary.
    """

    file_path = Path(config_dir) / file_name

    if not file_path.exists():
        raise FileNotFoundError(f"YAML file not found: {file_path}")

    with open(file_path, "r") as file:
        config = yaml.safe_load(file)

    return config