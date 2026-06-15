WITH source AS (

    SELECT
        RAW_DATA,
        LOAD_TIMESTAMP
    FROM RAW.USERS_USER

),

flattened AS (

    SELECT
        value AS user_record,
        LOAD_TIMESTAMP
    FROM source,
    LATERAL FLATTEN(input => RAW_DATA)

)

SELECT

    user_record:id::NUMBER           AS user_id,
    user_record:email::VARCHAR       AS email,
    user_record:mobile::VARCHAR      AS mobile,
    user_record:is_active::BOOLEAN   AS is_active,
    LOAD_TIMESTAMP

FROM flattened