from dotenv import load_dotenv
import subprocess
from pathlib import Path
import os

# Load .env explicitly
env_file = Path(__file__).parent.parent / ".env"
load_dotenv(env_file)

# Pass environment to dbt
subprocess.run(
    ["dbt", "snapshot", "--profiles-dir", "."],
    cwd=Path(__file__).parent,
    env=os.environ
)