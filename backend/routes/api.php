<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\TicketController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\SlaPolicyController;

Route::prefix('v1')->group(function () {
    // Public routes
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Protected routes (require sanctum authentication & tenant scoping)
    Route::middleware(['auth:sanctum', 'tenant'])->group(function () {
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Tickets CRUD
        Route::apiResource('tickets', TicketController::class);

        // Conversations (threaded replies)
        Route::get('/tickets/{ticket}/conversations', [ConversationController::class, 'index']);
        Route::post('/tickets/{ticket}/conversations', [ConversationController::class, 'store']);

        // SLA Policies
        Route::get('/sla-policies', [SlaPolicyController::class, 'index']);
        Route::post('/sla-policies', [SlaPolicyController::class, 'store']);

        // Users endpoint (to fetch members of current organization for assignments, etc.)
        Route::get('/users', function () {
            // Due to the BelongsToOrganisation trait, User::all() returns only organization members
            return response()->json(\App\Models\User::all());
        });
    });
});
