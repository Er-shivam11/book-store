{{ config(
    materialized='incremental',
    unique_key='user_id'
) }}

WITH src AS (

    SELECT
        user_id,
        email,
        mobile,
        is_active,
        load_timestamp

    FROM {{ ref('stg_users') }}

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

FROM src

{% if is_incremental() %}

WHERE load_timestamp > (
    SELECT COALESCE(MAX(load_timestamp), '1900-01-01')
    FROM {{ this }}
)

{% endif %}