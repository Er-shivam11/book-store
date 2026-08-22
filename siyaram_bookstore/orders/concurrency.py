# orders/concurrency.py
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor  # Concurrency modules

def process_order(order_id):  # Task function
    print(f"Processing {order_id}")

def run_threading(order_ids):
    with ThreadPoolExecutor(max_workers=5) as executor:  # Multithreading (IO-bound)
        executor.map(process_order, order_ids)

def run_multiprocessing(order_ids):
    with ProcessPoolExecutor(max_workers=2) as executor:  # Multiprocessing (CPU-bound)
        executor.map(process_order, order_ids)