from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime, timedelta

# ---------------------------
# DEFAULT CONFIG
# ---------------------------
default_args = {
    "owner": "data_platform_team",
    "depends_on_past": False,
    "retries": 2,
    "retry_delay": timedelta(minutes=5),
}

# ---------------------------
# DAG DEFINITION
# ---------------------------
with DAG(
    dag_id="bookstore_dbt_pipeline",
    default_args=default_args,
    description="Bookstore ELT pipeline: dbt run → snapshot → test",
    schedule_interval="@daily",
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=["dbt", "snowflake", "bookstore"],
) as dag:

    # ---------------------------
    # STEP 1: dbt run (staging → marts)
    # ---------------------------
    dbt_run = BashOperator(
        task_id="dbt_run",
        bash_command="""
        cd /opt/airflow/data_platform/transform &&
        dbt run --profiles-dir .
        """
    )

    # ---------------------------
    # STEP 2: dbt snapshot (SCD Type 2)
    # ---------------------------
    dbt_snapshot = BashOperator(
        task_id="dbt_snapshot",
        bash_command="""
        cd /opt/airflow/data_platform/transform &&
        dbt snapshot --profiles-dir .
        """
    )

    # ---------------------------
    # STEP 3: dbt test (data quality)
    # ---------------------------
    dbt_test = BashOperator(
        task_id="dbt_test",
        bash_command="""
        cd /opt/airflow/data_platform/transform &&
        dbt test --profiles-dir .
        """
    )

    # ---------------------------
    # PIPELINE ORDER
    # ---------------------------
    dbt_run >> dbt_snapshot >> dbt_test