<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/
// TODO: Create API operation log middleware so that it can observe errors and chase easily.

Route::namespace('Admin')->prefix('admin')->name('admin.')->group(function () {

    // AUTH
    Route::post('/login', 'AuthController@login')->name('login');
    Route::get('/auth', 'AuthController@auth')->name('auth');

    // CHANGE PASSWORDS
    Route::post('/resetPasswords/send', 'ResetPasswordController@send')->name('resetPasswords.send');
    Route::post('/resetPasswords/change', 'ResetPasswordController@change')->name('resetPasswords.change');

    // After authentication
    Route::middleware('auth:sanctum')->group(function () {

        // AUTH
        Route::post('/logout', 'AuthController@logout')->name('logout');

        // USERS
        Route::get('/users', 'UserController@index')->name('users.index');
        Route::post('/users', 'UserController@store')->name('users.store');
        Route::get('/users/{user}/edit', 'UserController@edit')->name('users.edit');
        Route::put('/users/{user}', 'UserController@update')->name('users.update');
        Route::delete('/users', 'UserController@destroy')->name('users.destroy');
        Route::post('/users/csv', 'UserController@csvExport')->name('users.csvExport');

        // ADMINS
        Route::get('/admins', 'AdminController@index')->name('admins.index');
        Route::post('/admins', 'AdminController@store')->name('admins.store');
        Route::get('/admins/{admin}/edit', 'AdminController@edit')->name('admins.edit');
        Route::put('/admins/{admin}', 'AdminController@update')->name('admins.update');
        Route::delete('/admins', 'AdminController@destroy')->name('admins.destroy');
        Route::post('/admins/csv', 'AdminController@csvExport')->name('admins.csvExport');

        // NOTIFICATIONS
        Route::get('/notifications', 'NotificationController@index')->name('notifications.index');
        Route::post('/notifications', 'NotificationController@store')->name('notifications.store');
        Route::get('/notifications/{notification}/edit', 'NotificationController@edit')->name('notifications.edit');
        Route::put('/notifications/{notification}', 'NotificationController@update')->name('notifications.update');
        Route::delete('/notifications', 'NotificationController@destroy')->name('notifications.destroy');
        Route::post('/notifications/csv', 'NotificationController@csvExport')->name('notifications.csvExport');

        // CONTACTS
        Route::get('/contacts', 'ContactController@index')->name('contacts.index');
        Route::get('/contacts/{contact}/edit', 'ContactController@edit')->name('contacts.edit');
        Route::put('/contacts/{contact}', 'ContactController@update')->name('contacts.update');
        Route::delete('/contacts', 'ContactController@destroy')->name('contacts.destroy');
        Route::post('/contacts/csv', 'ContactController@csvExport')->name('contacts.csvExport');

        // ITEMS
        Route::get('/items', 'ItemController@index')->name('items.index');
        Route::get('/items/create', 'ItemController@create')->name('items.create');
        Route::post('/items', 'ItemController@store')->name('items.store');
        Route::get('/items/{item}/edit', 'ItemController@edit')->name('items.edit');
        Route::post('/items/{item}', 'ItemController@update')->name('items.update')->where('item', '[0-9]+'); // POST only to receive files
        Route::delete('/items', 'ItemController@destroy')->name('items.destroy');
        Route::post('/items/measurements/{measurement}', 'ItemController@destroyMeasurement')->name('items.destroyMeasurement');
        Route::post('/items/skus/{sku}', 'ItemController@destroySku')->name('items.destroySku');
        Route::post('/items/images/{image}', 'ItemController@destroyImage')->name('items.destroyImage');
        Route::post('/items/csv', 'ItemController@csvExport')->name('items.csvExport');

        // BLOGS
        Route::get('/blogs', 'BlogController@index')->name('blogs.index');
        Route::get('/blogs/create', 'BlogController@create')->name('blogs.create');
        Route::post('/blogs', 'BlogController@store')->name('blogs.store');
        Route::get('/blogs/{blog}/edit', 'BlogController@edit')->name('blogs.edit');
        Route::post('/blogs/{blog}', 'BlogController@update')->name('blogs.update')->where('blog', '[0-9]+'); // POST only to receive files
        Route::delete('/blogs', 'BlogController@destroy')->name('blogs.destroy');
        Route::post('/blogs/csv', 'BlogController@csvExport')->name('blogs.csvExport');

        // NEWS
        Route::get('/news', 'NewsController@index')->name('news.index');
        Route::get('/news/create', 'NewsController@create')->name('news.create');
        Route::post('/news', 'NewsController@store')->name('news.store');
        Route::get('/news/{news}/edit', 'NewsController@edit')->name('news.edit');
        Route::post('/news/{news}', 'NewsController@update')->name('news.update')->where('news', '[0-9]+'); // POST only to receive files
        Route::delete('/news', 'NewsController@destroy')->name('news.destroy');
        Route::post('/news/csv', 'NewsController@csvExport')->name('news.csvExport');

        // ORDERS
        Route::get('/orders', 'OrderController@index')->name('orders.index');
        Route::get('/orders/{order}/edit', 'OrderController@edit')->name('orders.edit');
        Route::put('/orders/{order}', 'OrderController@update')->name('orders.update');
        Route::delete('/orders', 'OrderController@destroy')->name('orders.destroy');
        Route::post('/orders/csv', 'OrderController@csvExport')->name('orders.csvExport');

        // COLORS
        Route::get('/colors', 'ColorController@index')->name('colors.index');
        Route::post('/colors', 'ColorController@store')->name('colors.store');
        Route::put('/colors/{color}', 'ColorController@update')->name('colors.update');
        Route::delete('/colors/{color}', 'ColorController@destroy')->name('colors.destroy');

        // BRANDS
        Route::get('/brands', 'BrandController@index')->name('brands.index');
        Route::post('/brands', 'BrandController@store')->name('brands.store');
        Route::put('/brands/{brand}', 'BrandController@update')->name('brands.update');
        Route::delete('/brands/{brand}', 'BrandController@destroy')->name('brands.destroy');

        // TAGS
        Route::get('/tags', 'TagController@index')->name('tags.index');
        Route::post('/tags', 'TagController@store')->name('tags.store');
        Route::put('/tags/{tag}', 'TagController@update')->name('tags.update');
        Route::delete('/tags/{tag}', 'TagController@destroy')->name('tags.destroy');

        // CATEGORIES
        Route::get('/categories', 'CategoryController@index')->name('categories.index');
        Route::post('/categories', 'CategoryController@store')->name('categories.store');
        Route::put('/categories/{category}', 'CategoryController@update')->name('categories.update');
        Route::delete('/categories/{category}', 'CategoryController@destroy')->name('categories.destroy');

        // SIZES
        Route::get('/sizes', 'SizeController@index')->name('sizes.index');
        Route::post('/sizes', 'SizeController@store')->name('sizes.store');
        Route::put('/sizes/{size}', 'SizeController@update')->name('sizes.update');
        Route::delete('/sizes/{size}', 'SizeController@destroy')->name('sizes.destroy');
    });
});

Route::namespace('User')->prefix('user')->name('user.')->group(function () {

    // AUTH
    Route::post('/login', 'AuthController@login')->name('login');
    Route::get('/auth', 'AuthController@auth')->name('auth');

    // CHANGE PASSWORDS
    Route::post('/resetPasswords/send', 'ResetPasswordController@send')->name('resetPasswords.send');
    Route::post('/resetPasswords/change', 'ResetPasswordController@change')->name('resetPasswords.change');

    // TOP PAGE
    Route::get('/home', 'HomeController@index')->name('home.index');

    // ITEMS
    Route::get('/items', 'ItemController@index')->name('items.index');
    Route::get('/items/rank', 'ItemController@rank')->name('items.rank');
    Route::get('/items/recommend', 'ItemController@recommend')->name('items.recommend');
    Route::get('/items/new', 'ItemController@new')->name('items.new');
    Route::get('/items/option', 'ItemController@option')->name('items.option');
    Route::get('/items/{item}', 'ItemController@show')->name('items.show')->where('item', '[0-9]+');;

    // BLOGS
    Route::get('/blogs', 'BlogController@index')->name('blogs.index');
    Route::get('/blogs/{blog}', 'BlogController@show')->name('blogs.show');

    // NEWS
    Route::get('/news', 'NewsController@index')->name('news.index');
    Route::get('/news/{news}', 'NewsController@show')->name('news.show');

    // NOTIFICATIONS
    Route::get('/notifications', 'NotificationController@index')->name('notifications.index');

    // USERS
    Route::post('/users', 'UserController@store')->name('users.store');

    // CONTACTS
    Route::post('/contacts', 'ContactController@store')->name('contacts.store');


    // After authentication
    Route::middleware('auth:sanctum')->group(function () {

        // AUTH
        Route::post('/logout', 'AuthController@logout')->name('logout');

        // CARTS
        Route::get('/carts', 'CartController@index')->name('carts.index');
        Route::post('/carts', 'CartController@store')->name('carts.store');
        Route::put('/carts/{cart}', 'CartController@update')->name('carts.update');
        Route::delete('/carts/{cart}', 'CartController@destroy')->name('carts.destroy');

        // BOOKMARKS
        Route::get('/bookmarks', 'BookmarkController@index')->name('bookmarks.index');
        Route::post('/bookmarks', 'BookmarkController@store')->name('bookmarks.store');
        Route::delete('/bookmarks/{bookmark}', 'BookmarkController@destroy')->name('bookmarks.destroy');

        // ORDERS
        Route::get('/orders', 'OrderController@index')->name('orders.index');
        Route::post('/orders', 'OrderController@store')->name('orders.store');

        // USERS
        Route::get('/users/edit', 'UserController@edit')->name('users.edit');
        Route::put('/users/{user}', 'UserController@update')->name('users.update');
        Route::delete('/users/{user}', 'UserController@destroy')->name('users.destroy');
    });
});
