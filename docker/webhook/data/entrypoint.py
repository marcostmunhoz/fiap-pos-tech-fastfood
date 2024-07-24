import os
import mysql.connector
import requests

# Database configuration
MYSQL_DATABASE_HOST = os.getenv('MYSQL_DATABASE_HOST')
MYSQL_DATABASE_PORT = os.getenv('MYSQL_DATABASE_PORT')
MYSQL_DATABASE_NAME = os.getenv('MYSQL_DATABASE_NAME')
MYSQL_DATABASE_USERNAME = os.getenv('MYSQL_DATABASE_USERNAME')
MYSQL_DATABASE_PASSWORD = os.getenv('MYSQL_DATABASE_PASSWORD')

# Webhook configuration
WEBHOOK_URL = os.getenv('WEBHOOK_URL')

# Fetch data from the database
def fetch_data():
    conn = mysql.connector.connect(
        host=MYSQL_DATABASE_HOST,
        port=MYSQL_DATABASE_PORT,
        database=MYSQL_DATABASE_NAME,
        user=MYSQL_DATABASE_USERNAME,
        password=MYSQL_DATABASE_PASSWORD
    )
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM payments WHERE status = 'pending'")
    rows = cursor.fetchall()
    cursor.close()
    conn.close()
    return rows

# Dispatch POST request
def dispatch_post_request(id):
    data = {
        "event": "invoice.status_changed",
        "data": {
            "id": id,
            "status": "paid"
        }
    }
    response = requests.post(WEBHOOK_URL, json=data)
    return response.status_code

def main():
    rows = fetch_data()
    for row in rows:
        # Ignore id caa009cf-3dc2-4bf5-85a3-2e22f4a356a7 to prevent marking the test payment as completed
        if row['id'] == 'caa009cf-3dc2-4bf5-85a3-2e22f4a356a7':
            continue

        status_code = dispatch_post_request(row['external_payment_id'])
        print(f"Dispatched webhook for row {row['id']} | Status Code: {status_code}")

if __name__ == "__main__":
    main()