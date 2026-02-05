<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Public Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/auth/google', [AuthController::class, 'redirectToGoogle']);
Route::post('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']); // POST for API callback usually
Route::get('/auth/google/callback', [AuthController::class, 'handleGoogleCallback']);  // GET for browser redirect
Route::get('/auth/verify-email/{token}', [AuthController::class, 'verifyEmail']);
Route::post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/auth/reset-password', [AuthController::class, 'resetPassword']);

// Protected Routes (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']); // Refresh needs auth token logic
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/profile/update', [AuthController::class, 'updateProfile']);

    
    // Add all other protected API routes here
});
