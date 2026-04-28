<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CrmOrder extends Model
{
    use HasFactory;

    protected $fillable = [
        'crm_order_id',
        'certifier_name',
        'type',
        'value',
        'metal_purity',
        'image_url',
        'order_date',
        'title',
        'item',
        'diamond_color',
        'diamond_clarity',
        'diamond_weight',
        'diamond_shape',
        'diamond_cut',
        'diamond_measurement',
        'client_email',
        'client_mobile',
        'client_address',
        'diamond_skus',
        'company_name',
        'special_notes',
        'images',
        'is_used',
        'certificate_id',
    ];

    protected $casts = [
        'diamond_skus' => 'array',
        'images' => 'array',
        'order_date' => 'date',
        'value' => 'decimal:2',
        'diamond_weight' => 'decimal:2',
        'is_used' => 'boolean',
    ];

    public function certificate()
    {
        return $this->belongsTo(Certificate::class);
    }
}
