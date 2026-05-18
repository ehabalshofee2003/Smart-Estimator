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
Schema::create('chat_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('set null');
            $table->string('title')->default('جلسة تقدير جديدة');
            $table->string('current_step')->default('init'); // أهم حقل لتتبع مرحلة المحادثة
            $table->enum('status', ['active', 'completed', 'cancelled'])->default('active');
            $table->json('collected_data')->nullable(); // تخزين مؤقت للإجابات أثناء المحادثة
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chat_sessions');
    }
};
