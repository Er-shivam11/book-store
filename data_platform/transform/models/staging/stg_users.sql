WITH raw_data AS (

    SELECT *
    FROM {{ source('RAW', 'USERS_USER') }}

),

flattened AS (

    SELECT
        value:id::INT AS user_id,
        value:email::STRING AS email,
        value:mobile::STRING AS mobile,
        value:is_active::BOOLEAN AS is_active,
        load_timestamp

    FROM raw_data,
    LATERAL FLATTEN(input => raw_data)
)

SELECT *
FROM flattened