<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use App\Models\UserProfile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

Route::get('/login', function () {
    return inertia('Login');
})->name('login')->middleware('guest');

Route::post('/login',[AuthController::class, 'login'])->middleware('throttle:100,1');


Route::middleware('auth')->group(function () {
    Route::get('/home', function () {
        Log::info('Groove Streets, Home.');
        return inertia('Home');
    });

    Route::get('/post/{postId}', function ($postId) {
        return inertia('Profile', ['postId' => $postId]);
    });

    Route::get('/profile', function () {
        return inertia('Profile');
    });

    Route::get('/profile/{profileId}', function ($profileId) {
        return inertia('Profile', ['profileId' => $profileId]);
    });
   
    Route::get('/notifications', function () {
        return inertia('Notifications');
    });

    Route::get('/bookmarks', function () {
        $profileId = Auth::id();
        return inertia('BookmarkPage', ['profileId' => $profileId]);
    });

    Route::get('/getProfilePic', [ProfileController::class, 'getProfilePic']);

    Route::get('/logout', [AuthController::class, 'logout'])->middleware('throttle:100,1');
});