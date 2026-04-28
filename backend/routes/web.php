<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CertificateOrderController;

Route::get('/uploads/{path}', function ($path) {
    $file = public_path('uploads/' . $path);
    if (file_exists($file)) {
        $response = response()->file($file);
        $response->headers->set('Access-Control-Allow-Origin', 'http://localhost:5173');
        return $response;
    }
    abort(404);
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
