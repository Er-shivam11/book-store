
      
  
    

create or replace transient table BOOKSTORE_DW.SNAPSHOTS.users_snapshot
    
    
    
    as (
    

    select *,
        md5(coalesce(cast(user_id as varchar ), '')
         || '|' || coalesce(cast(load_timestamp as varchar ), '')
        ) as dbt_scd_id,
        load_timestamp as dbt_updated_at,
        load_timestamp as dbt_valid_from,
        
  
  coalesce(nullif(load_timestamp, load_timestamp), null)
  as dbt_valid_to
from (
        



SELECT
    user_id,
    email,
    mobile,
    is_active,
    load_timestamp

FROM BOOKSTORE_DW.STAGING.stg_users

    ) sbq



    )
;


  
  