<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class PayPalService
{
    protected string $clientId;
    protected string $clientSecret;
    protected string $baseUrl;

    public function __construct()
    {
        $this->clientId = config('paypal.client_id');
        $this->clientSecret = config('paypal.client_secret');
        $this->baseUrl = rtrim(config('paypal.base_url'), '/');
    }

    public function createOrder(float $amount, string $currency, array $payload = []): array
    {
        $body = [
            'intent' => 'CAPTURE',
            'purchase_units' => [[
                'amount' => [
                    'currency_code' => $currency,
                    'value' => number_format($amount, 2, '.', ''),
                ],
            ]],
            'application_context' => [
                'return_url' => $payload['return_url'] ?? $this->resolveCallbackUrl(config('paypal.return_url'), $payload['order_reference'] ?? null),
                'cancel_url' => $payload['cancel_url'] ?? $this->resolveCallbackUrl(config('paypal.cancel_url'), $payload['order_reference'] ?? null),
                'shipping_preference' => 'NO_SHIPPING',
                'brand_name' => $payload['brand_name'] ?? config('app.name', 'Certificate Portal'),
                'user_action' => 'PAY_NOW',
            ],
        ];

        if (!empty($payload['description'])) {
            $body['purchase_units'][0]['description'] = Str::limit($payload['description'], 127, '');
        }

        if (!empty($payload['custom_id'])) {
            $body['purchase_units'][0]['custom_id'] = Str::limit($payload['custom_id'], 127, '');
        }

        if (!empty($payload['shipping'])) {
            $body['purchase_units'][0]['shipping'] = $payload['shipping'];
            $body['application_context']['shipping_preference'] = 'SET_PROVIDED_ADDRESS';
        }

        $response = Http::withToken($this->accessToken())->post($this->endpoint('/v2/checkout/orders'), $body);

        if ($response->failed()) {
            throw new RuntimeException('Failed to create PayPal order: ' . $response->body());
        }

        return $response->json();
    }

    public function captureOrder(string $orderId): array
    {
        $response = Http::withToken($this->accessToken())
            ->send('POST', $this->endpoint('/v2/checkout/orders/' . $orderId . '/capture'), [
                'json' => new \stdClass(),
            ]);

        if ($response->failed()) {
            throw new RuntimeException('Failed to capture PayPal order: ' . $response->body());
        }

        return $response->json();
    }

    protected function accessToken(): string
    {
        if (empty($this->clientId) || empty($this->clientSecret)) {
            throw new RuntimeException('PayPal credentials are not configured.');
        }

        return Cache::remember('paypal_access_token', now()->addMinutes(50), function () {
            $response = Http::asForm()
                ->withBasicAuth($this->clientId, $this->clientSecret)
                ->post($this->endpoint('/v1/oauth2/token'), [
                    'grant_type' => 'client_credentials',
                ]);

            if ($response->failed()) {
                throw new RuntimeException('Failed to obtain PayPal access token: ' . $response->body());
            }

            return $response->json('access_token');
        });
    }

    protected function endpoint(string $path): string
    {
        return $this->baseUrl . $path;
    }

    protected function resolveCallbackUrl(string $template, ?string $orderReference): string
    {
        if ($orderReference === null) {
            return $template;
        }

        return str_replace('{order}', $orderReference, $template);
    }
}
