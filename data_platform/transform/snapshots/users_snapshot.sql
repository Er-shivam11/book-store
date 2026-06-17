{% snapshot users_snapshot %}

{{
    config(
        target_schema='SNAPSHOTS',
        unique_key='user_id',

        strategy='timestamp',
        updated_at='load_timestamp'
    )
}}

SELECT
    user_id,
    email,
    mobile,
    is_active,
    load_timestamp

FROM {{ ref('stg_users') }}

{% endsnapshot %}