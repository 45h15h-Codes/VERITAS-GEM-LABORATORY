<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CertificateOrderController;

Route::get('/{prefix}/{path}', function ($prefix, $path) {
    if (!in_array($prefix, ['uploads', 'certificates'])) {
        abort(404);
    }

    // Determine base directory
    $publicFile = public_path($prefix . '/' . $path);
    $storageFile = storage_path('app/public/' . ($prefix === 'uploads' ? '' : $prefix . '/') . $path);

    if (file_exists($publicFile)) {
        $file = $publicFile;
    } elseif (file_exists($storageFile)) {
        $file = $storageFile;
    } else {
        abort(404);
    }

    $response = response()->file($file);
    
    // Set CORS headers from environment variable
    $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
    $response->headers->set('Access-Control-Allow-Origin', $frontendUrl);
    $response->headers->set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    return $response;
})->where('path', '.*');


Route::get('/', function () {
    return view('welcome');
});

// Serve uploaded files with CORS headers

Route::get('/paypal/return/{order}', [CertificateOrderController::class, 'handleReturn'])
    ->name('paypal.return');

Route::get('/paypal/cancel/{order}', function ($orderId) {
    $order = \App\Models\CertificateOrder::find($orderId);
    
    if (!$order) {
        return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/payment-status?status=error');
    }
    
    $order->update(['status' => 'cancelled']);
    
    $certificate = $order->certificate;
    $certificateNumber = $certificate ? $certificate->certificate_number : '';
    
    return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/certificate/' . $certificateNumber . '?payment=cancelled');
})->name('paypal.cancel');
