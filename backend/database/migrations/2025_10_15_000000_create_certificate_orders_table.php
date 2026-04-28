<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('certificate_orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('certificate_id')->constrained()->cascadeOnDelete();
            $table->string('client_name');
            $table->string('email');
            $table->string('mobile')->nullable();
            $table->text('address');
            $table->string('status')->default('pending');
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('USD');
            $table->string('paypal_order_id')->unique()->nullable();
            $table->string('paypal_capture_id')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->json('paypal_payload')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificate_orders');
    }
};
