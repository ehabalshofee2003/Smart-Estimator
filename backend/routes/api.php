<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ChatController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\DashboardController;

// مسار الحصول على توكن الحماية للـ SPA
Route::get('/sanctum/csrf-cookie', function () {
    return response('CSRF Cookie Set');
});
// مسارات عامة (بدون تسجيل دخول)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// مسارات محمية (تتطلب تسجيل دخول عبر Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    
    // المصادقة
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']); // إضافة دالة user في AuthController

    // المحادثة والشات بوت
    Route::post('/chat/start', [ChatController::class, 'startSession']);
    Route::post('/chat/send', [ChatController::class, 'sendMessage']);
    Route::get('/chat/history/{sessionId}', [ChatController::class, 'getSessionHistory']);
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/reports/{projectId}/pdf', [ReportController::class, 'generatePdf']);
    Route::get('/chat/sessions', [ChatController::class, 'getSessions']);
    Route::get('/chat/sessions/{sessionId}', [ChatController::class, 'getSessionMessages']);
    Route::delete('/chat/sessions/{sessionId}', [ChatController::class, 'destroySession']);
    Route::delete('/projects/{projectId}', [ProjectController::class, 'destroy']);
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
});