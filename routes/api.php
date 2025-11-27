<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;

Route::get('/profiles', [ProfileController::class, 'getTestProfiles'])->middleware('throttle:10,1');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/create/post', [PostController::class, 'create'])->middleware('throttle:15,1');
    Route::post('/post/all', [PostController::class, 'index'])->middleware('throttle:200,1');
    Route::post('/getpost', [PostController::class, 'getPost'])->middleware('throttle:15,1');
    Route::post('/replies', [PostController::class, 'getReplies'])->middleware('throttle:30,1');
    Route::post('/likePost', [PostController::class, 'like'])->middleware('throttle:20,1');
    Route::post('/repostPost', [PostController::class, 'repost'])->middleware('throttle:20,1');
    Route::post('/bookmarkPost', [PostController::class, 'bookmark'])->middleware('throttle:20,1');

    Route::post('/profile/getProfile', [ProfileController::class, 'getProfile'])->middleware('throttle:15,1');
    Route::post('/profile/getPosts', [ProfileController::class, 'getProfilePosts'])->middleware('throttle:200,1');
    Route::post('/profile/getReplies', [ProfileController::class, 'getProfileReplies'])->middleware('throttle:200,1');
    Route::post('/profile/getMedia', [ProfileController::class, 'getProfileMedia'])->middleware('throttle:40,1');
    Route::post('/profile/getLikes', [ProfileController::class, 'getProfileLikes'])->middleware('throttle:40,1');
    Route::post('/profile/follow', [ProfileController::class, 'follow'])->middleware('throttle:30,1');

    Route::post('/bookmarks/getBookmarks', [ProfileController::class, 'getProfileBookmark'])->middleware('throttle:120,1');
});