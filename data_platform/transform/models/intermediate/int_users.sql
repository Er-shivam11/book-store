WITH stg AS (
    SELECT *
   FROM {{ ref('stg_users') }}
)

SELECT
    user_id,
    email,
    mobile,

    CASE
        WHEN email IS NULL THEN 'NO_EMAIL'
        ELSE 'HAS_EMAIL'
    END AS email_status,

    CASE
        WHEN is_active = TRUE THEN 1
        ELSE 0
    END AS is_active_flag,

    load_timestamp

FROM stg