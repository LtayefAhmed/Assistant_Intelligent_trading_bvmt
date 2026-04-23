<?php

use App\Http\Controllers\AuthController;
use App\Http\Middleware\InjectJwtFromCookie;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');


Route::prefix('auth')->middleware(["throttle:10,1"])->group(function () {
    Route::post("register", [AuthController::class, 'register']);
    Route::post("login", [AuthController::class, 'login']);
    Route::post("refresh", [AuthController::class, 'refresh']);
    Route::post("logout", [AuthController::class, 'logout']);
    Route::get('/email/verify/{id}/{hash}', [AuthController::class, 'verify'])
        ->name('verification.verify');
    Route::post('verify_resend', [AuthController::class, 'resend']);
    Route::post('/forgot-password', [AuthController::class, 'forgot']);
    Route::post('/reset-password', [AuthController::class, 'reset']);
    Route::post('/verify-reset-token', [AuthController::class, 'verifyToken']);
    Route::post('/find-email-by-token', [AuthController::class, 'findEmailByToken']);
});

Route::middleware([InjectJwtFromCookie::class, 'auth:api'])->group(function () {
    Route::get("me", [AuthController::class, "me"]);
    Route::post("logout", [AuthController::class, 'logout']);
    Route::post("profile", [AuthController::class, 'updateProfile']);
});
