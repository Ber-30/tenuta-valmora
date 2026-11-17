#!/usr/bin/env python3
"""
Tenuta Valmora - Server Locale Multi-thread con API Stripe
Usa ThreadingHTTPServer per gestire richieste concorrenti senza blocchi o rallentamenti.
"""

import http.server
import urllib.request
import urllib.parse
import json
import os
import sys

PORT = 3000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))
STRIPE_SECRET_KEY = os.environ.get(
    'STRIPE_SECRET_KEY',
    'sk_test_51UcT3aDodjpmDiIwVz4Lvu0m1yprxZ4PNMDJBaoh0uzYP6E6bTDpPQ7DuA3liDdL12LpkIlSI51zWxHbXPsIDOau00P6EVephz'
)

class ValmoraHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_POST(self):
        if self.path == '/api/create-payment-intent':
            content_length = int(self.headers.get('Content-Length', 0))
            post_body = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_body.decode('utf-8'))
                amount_cents = int(round(float(data.get('amount', 35.90)) * 100))
                description = data.get('description', 'Ordine Tenuta Valmora')
                customer_email = data.get('customerEmail', 'cliente@example.com')
                customer_name = data.get('customerName', 'Cliente Valmora')
                
                # Chiama l'API Stripe ufficiale
                stripe_url = 'https://api.stripe.com/v1/payment_intents'
                stripe_headers = {
                    'Authorization': f'Bearer {STRIPE_SECRET_KEY}',
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
                
                stripe_payload = urllib.parse.urlencode({
                    'amount': str(amount_cents),
                    'currency': 'eur',
                    'description': f'{description} ({customer_name} - {customer_email})',
                    'payment_method': 'pm_card_visa',
                    'confirm': 'true',
                    'return_url': 'http://localhost:3000/ordine-confermato.html',
                    'receipt_email': customer_email
                }).encode('utf-8')
                
                req = urllib.request.Request(stripe_url, data=stripe_payload, headers=stripe_headers)
                with urllib.request.urlopen(req, timeout=10) as resp:
                    stripe_res = json.loads(resp.read().decode('utf-8'))
                    
                response_data = {
                    'success': True,
                    'paymentIntentId': stripe_res.get('id'),
                    'status': stripe_res.get('status'),
                    'amount': stripe_res.get('amount') / 100.0
                }
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(response_data).encode('utf-8'))
                print(f"[STRIPE SUCCESS] Pagamento registrato: {stripe_res.get('id')} - €{stripe_res.get('amount')/100.0}")
                
            except Exception as e:
                print(f"[STRIPE ERROR] {e}")
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'success': False, 'error': str(e)}).encode('utf-8'))
        else:
            self.send_error(404, "Endpoint non trovato")

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

if __name__ == '__main__':
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    with http.server.ThreadingHTTPServer(("", PORT), ValmoraHandler) as httpd:
        print(f"Tenuta Valmora Threading Server attivo su http://localhost:{PORT}")
        print(f"Stripe Test Mode connesso con account acct_1Uc9TdHABkv2DTVQ")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer arrestato.")
