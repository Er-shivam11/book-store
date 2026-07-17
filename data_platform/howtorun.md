# 🚀 Data Platform - End-to-End Execution Guide

## 1️⃣ Insert / Update data in PostgreSQL

Use one of the following:

* Django Admin
* pgAdmin
* SQL Query

Example:

```sql
UPDATE users_user
SET
    email='new@gmail.com',
    is_active=false
WHERE id=1;
```

---

# 2️⃣ Extract PostgreSQL → Local JSON

Run the extraction script.

```bash
python -m scripts.run_extraction
```

Output:

```text
PostgreSQL
      ↓
Python Objects
      ↓
ingestion/storage/raw/users_user/YYYY-MM-DD.json
```

---

# 3️⃣ Load Local JSON → Snowflake RAW

```bash
python -m scripts.run_snowflake_loader
```

Output:

```text
Snowflake

BOOKSTORE_DW.RAW.USERS_USER
```

---

# 4️⃣ Run dbt Models

```bash
python transform/run_dbt_run.py
```

Builds:

```text
RAW
   ↓
STAGING
   ↓
INTERMEDIATE
   ↓
MARTS
```

Creates:

```text
STAGING.STG_USERS

INTERMEDIATE.INT_USERS

MARTS.DIM_USERS

MARTS.FACT_USERS_INCREMENTAL
```

---

# 5️⃣ Run Snapshot (SCD Type 2)

```bash
python transform/run_dbt_snapshot.py
```

Builds:

```text
SNAPSHOTS.USERS_SNAPSHOT
```

This preserves historical versions of user records.

---

# 6️⃣ Run Data Quality Tests

```bash
python transform/run_dbt_test.py
```

Current tests:

* not_null
* unique

Future tests:

* relationships
* accepted_values
* freshness

---

# 7️⃣ Verify in Snowflake

Check the following objects:

```text
RAW.USERS_USER

↓

STAGING.STG_USERS

↓

INTERMEDIATE.INT_USERS

↓

MARTS.DIM_USERS

↓

MARTS.FACT_USERS_INCREMENTAL

↓

SNAPSHOTS.USERS_SNAPSHOT
```

---

# 8️⃣ Update PostgreSQL Again

Example:

```sql
UPDATE users_user
SET
    email='updated@gmail.com',
    is_active=true
WHERE id=1;
```

or insert a new record.

---

# 9️⃣ Execute the Pipeline Again

```bash
python -m scripts.run_extraction

python -m scripts.run_snowflake_loader

python transform/run_dbt_run.py

python transform/run_dbt_snapshot.py

python transform/run_dbt_test.py
```

---

# 🔟 Verify Snapshot History

```sql
SELECT *
FROM SNAPSHOTS.USERS_SNAPSHOT
ORDER BY DBT_VALID_FROM DESC;
```

You should see:

* previous version
* latest version
* valid_from
* valid_to

---

# 📊 Complete ELT Pipeline Flow

```text
                 PostgreSQL
                      │
                      ▼
        python -m scripts.run_extraction
                      │
                      ▼
          Local RAW JSON Files
                      │
                      ▼
    python -m scripts.run_snowflake_loader
                      │
                      ▼
             Snowflake RAW Layer
                      │
                      ▼
        python transform/run_dbt_run.py
                      │
                      ▼
                STAGING Layer
                      │
                      ▼
             INTERMEDIATE Layer
                      │
                      ▼
                 MARTS Layer
                      │
                      ▼
    python transform/run_dbt_snapshot.py
                      │
                      ▼
              SNAPSHOTS Layer
                      │
                      ▼
      python transform/run_dbt_test.py
                      │
                      ▼
          Data Quality Validation
                      │
                      ▼
             BI / Analytics Ready
```

---

# 🚀 Future Production Flow (Airflow)

In production, these commands are executed automatically by an Airflow DAG:

```text
Extract
   ↓
Load RAW
   ↓
dbt Run
   ↓
Snapshot
   ↓
dbt Test
   ↓
Notify / Monitor
```
