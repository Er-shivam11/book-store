# orders/utils.py
from contextlib import contextmanager  # Context managers
import asyncio  # Async IO
from functools import lru_cache  # LRU cache
from django.db.models import Count, F, Window  # Advanced queries
from django.db.models.functions import RowNumber  # Window function
from .models import Order
import copy
# Shallow vs deep copy demo
def copy_order_example(order):
    shallow = copy.copy(order)  # Shallow copy
    deep = copy.deepcopy(order)  # Deep copy
    return shallow, deep

# Custom exception
class OrderException(Exception):  # For order-specific errors
    pass

# Context manager demo
@contextmanager
def open_file_demo(file_path, mode="w"):
    f = open(file_path, mode)  # Open file
    try:
        yield f  # Yield file object
    finally:
        f.close()  # Close safely

# Decorator & closure demo
def log_decorator(func):
    def wrapper(*args, **kwargs):
        print(f"[LOG] Calling {func.__name__}")  # Pre-call log
        result = func(*args, **kwargs)  # Call original function
        print(f"[LOG] Finished {func.__name__}")  # Post-call log
        return result
    return wrapper

# Generator demo
def order_generator(order_list):
    for order in order_list:
        yield order  # Yield each order

# Async function demo
async def async_order_process(order):
    print(f"Processing order #{order.id} asynchronously...")
    await asyncio.sleep(1)  # Simulate async IO
    print(f"Order #{order.id} processed!")

# LRU cache demo
@lru_cache(maxsize=128)
def get_order_by_id(order_id):
    try:
        return Order.objects.get(id=order_id)  # Fetch from DB
    except Order.DoesNotExist:
        return None  # Return None if missing

# Advanced queryset examples
def user_order_counts():
    return Order.objects.values('user__username').annotate(total_orders=Count('id')).order_by('-total_orders')  # Group By

def order_ranking():
    return Order.objects.annotate(rank=Window(expression=RowNumber(), partition_by=[F('user')], order_by=F('quantity').desc()))  # Window function

def orders_with_optional_completed():
    return Order.objects.filter(completed__isnull=False)  # Filter NULL
