<?php

namespace App\Http\Controllers;

use App\Models\Certificate;
use App\Models\CertificateOrder;
use App\Services\PayPalService;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use RuntimeException;

class CertificateOrderController extends Controller
{
    public function index()
    {
        $orders = CertificateOrder::with('certificate')
            ->latest()
            ->get()
            ->map(function (CertificateOrder $order) {
                return [
                    'id' => $order->id,
                    'certificate_id' => $order->certificate_id,
                    'certificate_number' => optional($order->certificate)->certificate_number,
                    'title' => optional($order->certificate)->title,
                    'client_name' => $order->client_name,
                    'email' => $order->email,
                    'mobile' => $order->mobile,
                    'address' => $order->address,
                    'payment_id' => $order->paypal_capture_id ?? $order->paypal_order_id,
                    'amount' => (float) $order->amount,
                    'status' => $order->status,
                    'currency' => $order->currency,
                    'created_at' => optional($order->created_at)->toIso8601String(),
                    'updated_at' => optional($order->updated_at)->toIso8601String(),
                ];
            });

        return response()->json($orders);
    }

    public function store(Request $request, Certificate $certificate, PayPalService $payPal)
    {
        $data = $request->validate([
            'client_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255'],
            'mobile' => ['required', 'string', 'max:50'],
            'address' => ['required', 'string'],
        ]);

        $data = collect($data)
            ->map(fn($value) => is_string($value) ? trim($value) : $value)
            ->all();

        $amount = (float) config('paypal.physical_certificate_price', 25.00);
        $currency = config('paypal.currency', 'USD');

        $orderRecord = CertificateOrder::create([
            'certificate_id' => $certificate->id,
            'client_name' => $data['client_name'],
            'email' => $data['email'],
            'mobile' => $data['mobile'],
            'address' => $data['address'],
            'status' => 'pending',
            'amount' => $amount,
            'currency' => $currency,
        ]);

        try {
            $response = $payPal->createOrder($amount, $currency, [
                'description' => 'Physical copy of certificate ' . $certificate->certificate_number,
                'custom_id' => (string) $orderRecord->id,
                'order_reference' => (string) $orderRecord->id,
            ]);
        } catch (RuntimeException $exception) {
            Log::error('PayPal order creation failed', [
                'message' => $exception->getMessage(),
                'certificate_id' => $certificate->id,
                'order_id' => $orderRecord->id,
            ]);

            $orderRecord->update(['status' => 'failed']);

            return response()->json([
                'message' => 'Unable to initiate payment at the moment. Please try again later.',
            ], 502);
        }

        $paypalOrderId = Arr::get($response, 'id');
        $approveUrl = collect(Arr::get($response, 'links', []))
            ->firstWhere('rel', 'approve')['href'] ?? null;

        $orderRecord->update([
            'paypal_order_id' => $paypalOrderId,
            'paypal_payload' => $response,
        ]);

        if (!$paypalOrderId || !$approveUrl) {
            Log::error('PayPal order missing approval data', [
                'response' => $response,
                'order_id' => $orderRecord->id,
            ]);

            $orderRecord->update(['status' => 'failed']);

            return response()->json([
                'message' => 'Payment provider returned an unexpected response.',
            ], 502);
        }

        return response()->json([
            'order_id' => $orderRecord->id,
            'paypal_order_id' => $paypalOrderId,
            'approval_url' => $approveUrl,
        ], 201);
    }

    public function updateStatus(Request $request, CertificateOrder $order)
    {
        $data = $request->validate([
            'status' => ['required', 'in:pending,completed,shipped,cancelled,failed'],
        ]);

        $order->update(['status' => $data['status']]);

        return response()->json([
            'message' => 'Payment status updated.',
            'order' => $order,
        ]);
    }

    public function handleReturn(Request $request, CertificateOrder $order, PayPalService $payPal)
    {
        $paypalOrderId = $request->query('token');

        if (!$paypalOrderId || $order->paypal_order_id !== $paypalOrderId) {
            Log::warning('PayPal return with mismatched token', [
                'expected' => $order->paypal_order_id,
                'received' => $paypalOrderId,
                'order_id' => $order->id,
            ]);

            return redirect()->away($this->buildFrontendRedirectUrl('error', $order));
        }

        try {
            $capture = $payPal->captureOrder($paypalOrderId);
        } catch (RuntimeException $exception) {
            Log::error('PayPal capture failed', [
                'message' => $exception->getMessage(),
                'order_id' => $order->id,
            ]);

            $order->update(['status' => 'failed']);

            return redirect()->away($this->buildFrontendRedirectUrl('error', $order));
        }

        $captureId = Arr::get($capture, 'purchase_units.0.payments.captures.0.id');

        $order->update([
            'status' => 'completed',
            'paypal_capture_id' => $captureId,
            'paypal_payload' => $capture,
            'paid_at' => now(),
        ]);

        return redirect()->away($this->buildFrontendRedirectUrl('success', $order));
    }

    public function handleCancel(Request $request, CertificateOrder $order)
    {
        $paypalOrderId = $request->query('token');

        if ($paypalOrderId && $order->paypal_order_id && $paypalOrderId !== $order->paypal_order_id) {
            Log::warning('PayPal cancel with mismatched token', [
                'expected' => $order->paypal_order_id,
                'received' => $paypalOrderId,
                'order_id' => $order->id,
            ]);
        }

        $order->update(['status' => 'cancelled']);

        return redirect()->away($this->buildFrontendRedirectUrl('cancelled', $order));
    }

    protected function buildFrontendRedirectUrl(string $status, CertificateOrder $order): string
    {
        $base = match ($status) {
            'success' => config('paypal.frontend_success_url'),
            'cancelled' => config('paypal.frontend_cancel_url'),
            default => config('paypal.frontend_cancel_url'),
        };

        if (empty($base)) {
            $base = rtrim(config('app.url'), '/') . '/';
        }

        $separator = str_contains($base, '?') ? '&' : '?';

        return $base . $separator . http_build_query([
            'status' => $status,
            'order' => $order->id,
        ]);
    }
}
