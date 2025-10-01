<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return inertia('Home');
});

Route::get('/profile', function () {
    return inertia('Profile');
});

Route::get('/notifications', function () {
    return inertia('Notifications');
});