# data_platform/orchestration/dags/dbt_pipeline_dag.py
from airflow import DAG
from airflow.operators.bash import BashOperator
from datetime import datetime, timedelta


# ---------------------------------------
# DEFAULT DAG CONFIGURATION
# ---------------------------------------
default_args = {
    "owner": "data_platform_team",
    "depends_on_past": False,
    "retries": 2,
    "retry_delay": timedelta(minutes=2),
}


# ---------------------------------------
# DAG DEFINITION
# ---------------------------------------
with DAG(
    dag_id="bookstore_full_pipeline",
    default_args=default_args,
    description="PostgreSQL -> RAW JSON -> Snowflake -> dbt pipeline",
    schedule="@daily",
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=[
        "bookstore",
        "data-platform",
        "snowflake",
        "dbt",
        "airflow",
    ],
) as dag:

    # ---------------------------------------
    # STEP 1
    # PostgreSQL -> Local RAW JSON
    # ---------------------------------------
    extract_and_local_load = BashOperator(
        task_id="extract_and_local_load",
        bash_command="""
        cd /opt/airflow/data_platform &&
        python -m scripts.run_local_loader
        """
    )

    # ---------------------------------------
    # STEP 2
    # Local RAW JSON -> Snowflake RAW
    # ---------------------------------------
    load_to_snowflake = BashOperator(
        task_id="load_to_snowflake",
        bash_command="""
        cd /opt/airflow/data_platform &&
        python -m scripts.run_snowflake_loader
        """
    )

    # ---------------------------------------
    # STEP 3
    # dbt Models
    # RAW -> STAGING -> INTERMEDIATE -> MARTS
    # ---------------------------------------
    dbt_run = BashOperator(
        task_id="dbt_run",
        bash_command="""
        cd /opt/airflow/data_platform/transform &&
        dbt run --profiles-dir .
        """
    )

    # ---------------------------------------
    # STEP 4
    # SCD Type 2 Snapshots
    # ---------------------------------------
    dbt_snapshot = BashOperator(
        task_id="dbt_snapshot",
        bash_command="""
        cd /opt/airflow/data_platform/transform &&
        dbt snapshot --profiles-dir .
        """
    )

    # ---------------------------------------
    # STEP 5
    # Data Quality Validation
    # ---------------------------------------
    dbt_test = BashOperator(
        task_id="dbt_test",
        bash_command="""
        cd /opt/airflow/data_platform/transform &&
        dbt test --profiles-dir .
        """
    )

    # ---------------------------------------
    # PIPELINE EXECUTION ORDER
    # ---------------------------------------
    (
        extract_and_local_load
        >> load_to_snowflake
        >> dbt_run
        >> dbt_snapshot
        >> dbt_test
    )