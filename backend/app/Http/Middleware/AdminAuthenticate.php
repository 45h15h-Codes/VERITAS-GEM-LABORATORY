<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuthenticate
{
    public function handle(Request $request, Closure $next)
    {
        if (!Auth::guard('admin-api')->check()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        return $next($request);
    }
}
