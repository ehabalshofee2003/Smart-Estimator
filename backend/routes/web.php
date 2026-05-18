<?php

use Illuminate\Support\Facades\Route;

// Serve the React SPA for all non-API routes
Route::get('/{any}', function () {
    $indexPath = public_path('build/index.html');

    if (file_exists($indexPath)) {
        return response()->file($indexPath);
    }

    abort(404, 'Frontend build not found. Run `npm run build` to generate it.');
})->where('any', '^(?!api|sanctum).*$');
