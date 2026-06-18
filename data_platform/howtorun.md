
# 1️⃣ Insert/Update data in PostgreSQL

Use Django Admin, pgAdmin, or SQL.

(No Python file)

---

# 2️⃣ Extract from PostgreSQL → Local JSON

```bash
python ingestion/extractors/postgres_extractor.py
```

(or whatever your main extractor entry file is, if you have a wrapper script)

---

# 3️⃣ Load JSON → Snowflake RAW

Run your Snowflake loader:

```bash
python warehouse/loaders/snowflake_loader.py
```

---

# 4️⃣ Run dbt models

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

---

# 5️⃣ Run Snapshot

```bash
python transform/run_dbt_snapshot.py
```

Builds:

```text
SNAPSHOTS
```

---

# 6️⃣ Run Data Quality Tests

```bash
python transform/run_dbt_test.py
```

Checks:

* not_null
* unique
* relationships (later)
* accepted_values (later)

---

# 7️⃣ Verify in Snowflake

```sql
RAW.USERS_USER

↓

STAGING.STG_USERS

↓

INTERMEDIATE.INT_USERS

↓

MARTS.DIM_USERS

↓

SNAPSHOTS.USERS_SNAPSHOT
```

---

# 8️⃣ Update one record in PostgreSQL

For example:

```sql
UPDATE users_user
SET
email='new@gmail.com',
is_active=false
WHERE id=1;
```

---

# 9️⃣ Run again

```bash
python ingestion/extractors/postgres_extractor.py

python warehouse/loaders/snowflake_loader.py

python transform/run_dbt_run.py

python transform/run_dbt_snapshot.py

python transform/run_dbt_test.py
```

---

# 🔟 Verify Snapshot History

```sql
SELECT *
FROM SNAPSHOTS.USERS_SNAPSHOT;
```

You should see historical versions maintained according to your snapshot strategy.

---

# 🚀 Complete execution flow

```text
1. Update PostgreSQL
        ↓
2. postgres_extractor.py
        ↓
3. snowflake_loader.py
        ↓
4. run_dbt_run.py
        ↓
5. run_dbt_snapshot.py
        ↓
6. run_dbt_test.py
        ↓
7. Verify in Snowflake
        ↓
8. Update PostgreSQL again
        ↓
9. Repeat steps 2–7
```

This is the exact sequence you'll eventually automate in Airflow, where each of these commands becomes a separate task in the DAG.
