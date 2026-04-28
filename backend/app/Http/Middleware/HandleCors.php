<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class HandleCors
{
    public function handle(Request $request, Closure $next)
    {
        // Define your list of trusted frontend origins.
        $allowedOrigins = [
            'http://localhost:5173', // Your local dev frontend
            'http://localhost:3000',
            'http://127.0.0.1:5173',
            // 'https://your-production-app.com', // Your live domain
        ];

        $origin = $request->header('Origin');

        // Only set the header if the origin is in our trusted list.
        if (in_array($origin, $allowedOrigins)) {
            // Handle pre-flight OPTIONS requests.
            if ($request->isMethod('OPTIONS')) {
                return response('', 204)
                    ->header('Access-Control-Allow-Origin', $origin)
                    ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
                    ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
                    ->header('Access-Control-Allow-Credentials', 'true')
                    ->header('Access-Control-Max-Age', '86400');
            }

            // For all other requests, get the response first.
            $response = $next($request);

            // And then attach the headers.
            $response->headers->set('Access-Control-Allow-Origin', $origin);
            $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
            $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
            $response->headers->set('Access-Control-Allow-Credentials', 'true');

            return $response;
        }

        // If the origin is not allowed, just continue without adding CORS headers.
        return $next($request);
    }
}
