-- back compat for old kwarg name
  
  begin;
    
        
            
            
            
            
        
    

    

    merge into BOOKSTORE_DW.MARTS.fact_users_incremental as DBT_INTERNAL_DEST
        using BOOKSTORE_DW.MARTS.fact_users_incremental__dbt_tmp as DBT_INTERNAL_SOURCE
        on ((DBT_INTERNAL_SOURCE.user_id = DBT_INTERNAL_DEST.user_id))

    
    when matched then update set
        "USER_ID" = DBT_INTERNAL_SOURCE."USER_ID","EMAIL" = DBT_INTERNAL_SOURCE."EMAIL","MOBILE" = DBT_INTERNAL_SOURCE."MOBILE","IS_ACTIVE" = DBT_INTERNAL_SOURCE."IS_ACTIVE","USER_STATUS" = DBT_INTERNAL_SOURCE."USER_STATUS","INGESTED_AT" = DBT_INTERNAL_SOURCE."INGESTED_AT"
    

    when not matched then insert
        ("USER_ID", "EMAIL", "MOBILE", "IS_ACTIVE", "USER_STATUS", "INGESTED_AT")
    values
        ("USER_ID", "EMAIL", "MOBILE", "IS_ACTIVE", "USER_STATUS", "INGESTED_AT")

;
    commit;