<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Certificate extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'certificate_number',
        'type',
        'certifier_name',
        'store',
        'image',
        'title',
        'date',
        'item',
        'length',
        'weight',
        'carat_weight',
        'gem_stone',
        'color',
        'clarity',
        'metal_purity',
        'value',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(CertificateOrder::class);
    }
}
