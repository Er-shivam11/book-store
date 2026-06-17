
    
    select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
  
    
    



select is_active_flag
from BOOKSTORE_DW.INTERMEDIATE.int_users
where is_active_flag is null



  
  
      
    ) dbt_internal_test