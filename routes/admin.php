<?php

use App\Http\Controllers\Admin\RolesController;
use App\Http\Controllers\Admin\UsersController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->as('admin.')
    ->group(function () {
        Route::redirect('/', '/admin/users')->name('home');
        Route::resource('users', UsersController::class)->except(['show']);
        Route::resource('roles', RolesController::class)->except(['show']);
    });
