
    
    select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
  
    
    



select load_timestamp
from BOOKSTORE_DW.MARTS.fact_users_incremental
where load_timestamp is null



  
  
      
    ) dbt_internal_test