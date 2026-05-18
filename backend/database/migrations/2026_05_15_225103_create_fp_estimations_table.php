<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
    Schema::create('fp_estimations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            
            // تخزين مكونات FPA كـ JSON لتسهيل الحفظ التدريجي
            // مثال: {"ei": {"low": 2, "avg": 1, "high": 0}, "eo": {...}, ...}
            $table->json('components')->nullable(); 
            
            // درجات الـ 14 خاصية (GSC) من 0 إلى 5 كمصفوفة JSON
            $table->json('gsc_scores')->nullable(); 
            
            // النتائج المحسوبة
            $table->decimal('ufp', 10, 2)->default(0); // Unadjusted Function Points
            $table->decimal('vaf', 10, 2)->default(0); // Value Adjustment Factor
            $table->decimal('afp', 10, 2)->default(0); // Adjusted Function Points
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fp_estimations');
    }
};
