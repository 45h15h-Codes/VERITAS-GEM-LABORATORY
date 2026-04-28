<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('crm_orders', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('crm_order_id')->unique();
            // ── Transformed fields (VGL certificate names) ──
            $table->string('certifier_name')->nullable();         // was: client_name
            $table->string('type')->nullable();                    // was: order_type (mapped)
            $table->decimal('value', 15, 2)->nullable();           // was: gross_sell
            $table->string('metal_purity')->nullable();            // was: gold_detail.name
            $table->string('image_url')->nullable();               // was: images[0]
            $table->date('order_date')->nullable();                 // was: created_at
            $table->text('title')->nullable();                     // was: jewellery_details
            $table->text('item')->nullable();                      // was: product_other
            // ── Diamond data ──
            $table->string('diamond_color')->nullable();
            $table->string('diamond_clarity')->nullable();
            $table->decimal('diamond_weight', 8, 2)->nullable();
            $table->string('diamond_shape')->nullable();
            $table->string('diamond_cut')->nullable();
            $table->string('diamond_measurement')->nullable();
            // ── Reference data (display only) ──
            $table->string('client_email')->nullable();
            $table->string('client_mobile')->nullable();
            $table->text('client_address')->nullable();
            $table->json('diamond_skus')->nullable();
            $table->string('company_name')->nullable();
            $table->text('special_notes')->nullable();
            $table->json('images')->nullable();                    // All Cloudinary URLs
            // ── Status ──
            $table->boolean('is_used')->default(false);            // Certificate ban gaya toh true
            $table->foreignId('certificate_id')->nullable()
                ->constrained()->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crm_orders');
    }
};
