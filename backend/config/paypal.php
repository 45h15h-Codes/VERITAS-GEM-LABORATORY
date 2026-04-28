<?php

return [
    'mode' => env('PAYPAL_MODE', 'sandbox'),
    'client_id' => env('PAYPAL_CLIENT_ID', ''),
    'client_secret' => env('PAYPAL_CLIENT_SECRET', ''),
    'base_url' => env('PAYPAL_BASE_URL', env('PAYPAL_MODE', 'sandbox') === 'live'
        ? 'https://api-m.paypal.com'
        : 'https://api-m.sandbox.paypal.com'),
    'currency' => env('PAYPAL_CURRENCY', 'USD'),
    'physical_certificate_price' => (float) env('PAYPAL_PHYSICAL_CERT_PRICE', 25.00),
    'return_url' => env('PAYPAL_RETURN_URL', env('APP_URL') . '/paypal/return/{order}'),
    'cancel_url' => env('PAYPAL_CANCEL_URL', env('APP_URL') . '/paypal/cancel/{order}'),
    'frontend_success_url' => env('PAYPAL_FRONTEND_SUCCESS_URL', env('FRONTEND_URL') . '/payment-status'),
    'frontend_cancel_url' => env('PAYPAL_FRONTEND_CANCEL_URL', env('FRONTEND_URL') . '/payment-status'),
];
