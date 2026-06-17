
    
    select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
  
    
    



select user_status
from BOOKSTORE_DW.INTERMEDIATE.int_users
where user_status is null



  
  
      
    ) dbt_internal_test