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
 Schema::create('ucp_estimations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            
            // الممثلون وحالات الاستخدام كـ JSON
            $table->json('actors')->nullable();   // {"simple": 1, "average": 2, "complex": 0}
            $table->json('use_cases')->nullable(); // {"simple": 3, "average": 1, "complex": 2}
            
            // العوامل كـ JSON (مصفوفة أرقام)
            $table->json('technical_factors')->nullable();  // 12 عامل
            $table->json('environmental_factors')->nullable(); // 8 عوامل
            
            // النتائج المحسوبة
            $table->decimal('uaw', 10, 2)->default(0);  // Unadjusted Actor Weight
            $table->decimal('uucw', 10, 2)->default(0); // Unadjusted Use Case Weight
            $table->decimal('uucp', 10, 2)->default(0); // Unadjusted Use Case Points
            $table->decimal('tcf', 10, 2)->default(0);  // Technical Complexity Factor
            $table->decimal('ecf', 10, 2)->default(0);  // Environmental Complexity Factor
            $table->decimal('ucp', 10, 2)->default(0);  // Use Case Points
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ucp_estimations');
    }
};
