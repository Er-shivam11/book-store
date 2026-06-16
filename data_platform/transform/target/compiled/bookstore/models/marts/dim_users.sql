WITH int_users AS (

    SELECT *
    FROM BOOKSTORE_DW.INTERMEDIATE.int_users

)

SELECT

    -- 👤 Surrogate/business key
    user_id,

    -- 📧 Contact info
    email,
    mobile,

    -- 🧠 Business attributes (from intermediate layer)
    email_status,
    is_active_flag,

    -- 📊 Derived BI-friendly fields
    CASE 
        WHEN is_active_flag = 1 AND email_status = 'HAS_EMAIL' THEN 'ACTIVE_COMPLETE'
        WHEN is_active_flag = 1 THEN 'ACTIVE_INCOMPLETE'
        ELSE 'INACTIVE'
    END AS user_segment,

    -- 🕒 Audit column
    load_timestamp

FROM int_users