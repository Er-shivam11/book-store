import subprocess
from pathlib import Path

base_dir = Path(__file__).parent

# STEP 1: staging + marts
subprocess.run(
    ["dbt", "run", "--profiles-dir", "."],
    cwd=base_dir
)

# STEP 2: snapshot
subprocess.run(
    ["dbt", "snapshot", "--profiles-dir", "."],
    cwd=base_dir
)

# STEP 3: tests
subprocess.run(
    ["dbt", "test", "--profiles-dir", "."],
    cwd=base_dir
)