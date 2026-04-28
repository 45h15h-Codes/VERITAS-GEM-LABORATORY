<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\Admin;

class AdminAuthController extends Controller
{
    // Register a new admin
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:admins',
            'password' => 'required|string|min:6',
        ]);

        $admin = Admin::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json(['admin' => $admin], 201);
    }

    // Login admin
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $admin = Admin::where('email', $request->email)->first();
        if (!$admin || !Hash::check($request->password, $admin->password)) {
            return response()->json(['error' => 'Invalid credentials'], 401);
        }

        $token = $admin->createToken('admin-token')->plainTextToken;
        return response()->json([
            'token' => $token,
            'admin' => $admin,
        ]);
    }

    // Logout admin
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Logged out']);
    }
}
