
    
    select
      count(*) as failures,
      count(*) != 0 as should_warn,
      count(*) != 0 as should_error
    from (
      
    
  
    
    



select user_segment
from BOOKSTORE_DW.MARTS.dim_users
where user_segment is null



  
  
      
    ) dbt_internal_test