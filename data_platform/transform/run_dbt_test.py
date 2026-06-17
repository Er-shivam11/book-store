from dotenv import load_dotenv
import subprocess
from pathlib import Path

env_file = Path(__file__).parent.parent / ".env"

load_dotenv(env_file)

subprocess.run(
    ["dbt", "test"],
    cwd=Path(__file__).parent,
)