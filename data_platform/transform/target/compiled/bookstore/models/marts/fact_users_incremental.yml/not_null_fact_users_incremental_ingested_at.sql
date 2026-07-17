
    
    



select ingested_at
from BOOKSTORE_DW.MARTS.fact_users_incremental
where ingested_at is null


