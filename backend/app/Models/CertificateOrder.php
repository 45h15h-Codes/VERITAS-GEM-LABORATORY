<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CertificateOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'certificate_id',
        'client_name',
        'email',
        'mobile',
        'address',
        'status',
        'amount',
        'currency',
        'paypal_order_id',
        'paypal_capture_id',
        'paypal_payload',
        'paid_at',
    ];

    protected $casts = [
        'paypal_payload' => 'array',
        'paid_at' => 'datetime',
    ];

    public function certificate()
    {
        return $this->belongsTo(Certificate::class);
    }
}
