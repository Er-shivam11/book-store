
    
    select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
  
    
    



select user_type
from BOOKSTORE_DW.INTERMEDIATE.int_users
where user_type is null



  
  
      
    ) dbt_internal_test