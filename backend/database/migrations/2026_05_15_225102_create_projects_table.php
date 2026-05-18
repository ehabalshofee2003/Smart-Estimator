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
    Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('business_domain')->nullable();
            $table->enum('client_type', ['internal', 'external'])->nullable();
            $table->integer('expected_users')->default(0);
            $table->integer('team_size')->default(0);
            $table->string('technologies')->nullable();
            
            // نتائج التقدير النهائية
            $table->enum('complexity_level', ['small', 'medium', 'large', 'enterprise'])->default('small');
            $table->decimal('estimated_effort_hours', 10, 2)->default(0);
            $table->decimal('estimated_duration_months', 10, 2)->default(0);
            $table->decimal('estimated_cost', 10, 2)->default(0);
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
