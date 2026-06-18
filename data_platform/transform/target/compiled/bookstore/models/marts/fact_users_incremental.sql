

WITH src AS (

    SELECT *
    FROM BOOKSTORE_DW.STAGING.stg_users

),

latest_per_user AS (

    SELECT *
    FROM (
        SELECT *,
               ROW_NUMBER() OVER (
                   PARTITION BY user_id
                   ORDER BY load_timestamp DESC
               ) AS rn
        FROM src
    ) t
    WHERE rn = 1

)

SELECT
    user_id,
    email,
    mobile,
    is_active,

    CASE
        WHEN is_active = TRUE THEN 'ACTIVE'
        ELSE 'INACTIVE'
    END AS user_status,

    CURRENT_TIMESTAMP() AS ingested_at

FROM latest_per_user