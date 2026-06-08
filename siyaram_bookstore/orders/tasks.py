# orders/tasks.py
from celery import shared_task
import logging
import os

from django.core.files import File
from django.conf import settings
from django.template import Template, Context

from weasyprint import HTML

from .models import Order

logger = logging.getLogger('orders')


@shared_task
def generate_invoice_pdf(order_id):

    order = Order.objects.get(id=order_id)

    invoice_dir = os.path.join(settings.MEDIA_ROOT, "invoices")
    os.makedirs(invoice_dir, exist_ok=True)

    filename = f"invoice_{order.id}.pdf"
    file_path = os.path.join(invoice_dir, filename)

    # =========================
    # INLINE HTML TEMPLATE (NO FILE NEEDED)
    # =========================
    html_template = """
    <html>
    <head>
        <style>
            body {
                font-family: Arial;
                padding: 30px;
                color: #333;
            }

            .header {
                text-align: center;
                margin-bottom: 20px;
            }

            .header h1 {
                margin: 0;
                font-size: 24px;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 20px;
            }

            table, th, td {
                border: 1px solid #ddd;
            }

            th, td {
                padding: 10px;
                text-align: left;
            }

            th {
                background: #f4f4f4;
            }

            .total {
                text-align: right;
                margin-top: 20px;
                font-size: 18px;
                font-weight: bold;
            }

            .footer {
                margin-top: 40px;
                text-align: center;
                font-size: 13px;
            }
        </style>
    </head>

    <body>

    <div class="header">
        <h1>SIYARAM BOOK STORE</h1>
        <p>Invoice / Tax Invoice</p>
    </div>

    <p><strong>Invoice No:</strong> INV-{{ order.id }}</p>
    <p><strong>Order ID:</strong> {{ order.id }}</p>
    <p><strong>Customer:</strong> {{ order.buyer_name }}</p>
    <p><strong>Email:</strong> {{ order.email }}</p>

    <table>
        <tr>
            <th>Item</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
        </tr>

        {% for item in items %}
        <tr>
            <td>{{ item.product.title }}</td>
            <td>{{ item.quantity }}</td>
            <td>₹{{ item.price }}</td>
            <td>₹{{ item.quantity }} x {{ item.price }}</td>
        </tr>
        {% endfor %}
    </table>

    <div class="total">
        Grand Total: ₹{{ grand_total }}
    </div>

    <div class="footer">
        Payment Status: {{ order.status }} <br>
        Thank you for shopping with Siyaram Book Store!
    </div>

    </body>
    </html>
    """

    # =========================
    # DATA PREPARATION
    # =========================
    items = order.items.all()

    grand_total = sum(item.quantity * item.price for item in items)

    context = Context({
        "order": order,
        "items": items,
        "grand_total": grand_total
    })

    template = Template(html_template)
    html_string = template.render(context)

    # =========================
    # GENERATE PDF
    # =========================
    HTML(string=html_string).write_pdf(file_path)

    # =========================
    # SAVE TO MODEL FIELD
    # =========================
    with open(file_path, "rb") as pdf_file:
        order.invoice_pdf.save(
            filename,
            File(pdf_file),
            save=True
        )

    return f"Invoice generated for order {order.id}"