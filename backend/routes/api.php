<?php


use App\Http\Middleware\VerifyExternalApiKey;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CertificateController;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\StoreController;
use App\Http\Controllers\CertificateOrderController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\ExternalOrderController;
use App\Models\Store;

// ───── External API (CRM se data receive) ─────
Route::middleware(VerifyExternalApiKey::class)
    ->prefix('external')
    ->group(function () {
        Route::post('/orders', [ExternalOrderController::class, 'store']);
    });

// ───── CRM Orders (Admin — for certificate form import) ─────
Route::get('/crm-orders', [ExternalOrderController::class, 'index']);
Route::get('/crm-orders/{crmOrder}', [ExternalOrderController::class, 'show']);

// Admin Auth
Route::post('/admin/register', [AdminAuthController::class, 'register']);
Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::middleware('auth:admin-api')->post('/admin/logout', [AdminAuthController::class, 'logout']);

// Certificates
Route::get('/certificates/next-number', [CertificateController::class, 'nextNumber']);

Route::get('/certificates', [CertificateController::class, 'index']);
Route::post('/certificates', [CertificateController::class, 'store']);
Route::get('/certificates/{id}', [CertificateController::class, 'show']);
Route::put('/certificates/{id}', [CertificateController::class, 'update']);
Route::delete('/certificates/{id}', [CertificateController::class, 'destroy']);
Route::get('/search/{certificate_number}', [CertificateController::class, 'search']);

// Certificate PDF Downloads
Route::get('/certificates/{id}/download/pdf', [CertificateController::class, 'downloadPDF'])->name('certificate.download.pdf');
Route::get('/certificates/{id}/download/template1', [CertificateController::class, 'downloadTemplate1PDF'])->name('certificate.download.template1');
Route::get('/certificates/{id}/download/template2', [CertificateController::class, 'downloadTemplate2PDF'])->name('certificate.download.template2');
Route::get('/certificates/{id}/download/both', [CertificateController::class, 'downloadBothPDFs'])->name('certificate.download.both');

// Certificate PDF Stream (for preview)
Route::get('/certificates/{id}/stream/template1', [CertificateController::class, 'streamTemplate1PDF'])->name('certificate.stream.template1');
Route::get('/certificates/{id}/stream/template2', [CertificateController::class, 'streamTemplate2PDF'])->name('certificate.stream.template2');

// Stores
Route::get('/stores', [StoreController::class, 'index']);
// Route::get('/stores/{name}', function ($name) {
//     $store = Store::where('name', $name)->first();
//     return response()->json($store);
// });

// Certificate Physical Orders & Payments
Route::get('/payments', [CertificateOrderController::class, 'index']);
Route::put('/payments/{order}', [CertificateOrderController::class, 'updateStatus']);
Route::post('/certificates/{certificate}/physical-orders', [CertificateOrderController::class, 'store']);

// Blogs - Public routes
Route::get('/blogs', [BlogController::class, 'publicIndex']);
Route::get('/blogs/slug/{slug}', [BlogController::class, 'showBySlug']);

// Blogs - Admin routes
Route::get('/admin/blogs', [BlogController::class, 'index']);
Route::post('/admin/blogs', [BlogController::class, 'store']);
Route::get('/admin/blogs/{id}', [BlogController::class, 'show']);
Route::post('/admin/blogs/{id}', [BlogController::class, 'update']); // Using POST for file upload
Route::delete('/admin/blogs/{id}', [BlogController::class, 'destroy']);
