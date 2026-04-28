<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('certificates', function (Blueprint $table) {
            $table->id();
            $table->string('certificate_number')->unique();
            $table->enum('type', ['diamond', 'jewellery'])->default('jewellery');
            $table->string('certifier_name');
            $table->string('store');
            $table->string('image')->nullable();
            $table->string('title');
            $table->date('date');
            $table->string('item');
            $table->string('length')->nullable();
            $table->string('weight')->nullable();
            $table->string('carat_weight')->nullable();
            $table->string('gem_stone')->nullable();
            $table->string('color')->nullable();
            $table->string('clarity')->nullable();
            $table->string('metal_purity')->nullable();
            $table->decimal('value', 15, 2)->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('certificates');
    }
};
