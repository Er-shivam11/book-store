WITH int_users AS (

    SELECT *
    FROM BOOKSTORE_DW.INTERMEDIATE.int_users

),

deduped AS (

    SELECT *,
           ROW_NUMBER() OVER (
               PARTITION BY user_id
               ORDER BY load_timestamp DESC
           ) AS rn

    FROM int_users

)

SELECT
    user_id,
    email,
    mobile,
    email_status,
    is_active_flag,

    CASE 
        WHEN is_active_flag = 1 AND email_status = 'HAS_EMAIL' THEN 'ACTIVE_COMPLETE'
        WHEN is_active_flag = 1 THEN 'ACTIVE_INCOMPLETE'
        ELSE 'INACTIVE'
    END AS user_segment,

    load_timestamp

FROM deduped
WHERE rn = 1