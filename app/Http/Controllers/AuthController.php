<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class AuthController extends Controller
{
    public function login(Request $request)
    {
        try {
            $user = User::findOrFail($request->id);
            $email = $request->input('email', $user->email);
            $request->merge(['email' => $email, 'password' => 'password123']);

            $credentials = $request->validate([
                'email' => ['required', 'email'],
                'password' => ['required']
            ]);

            if (Auth::attempt($credentials)) {
                $request->session()->regenerate();

                return response()->json([
                    'status' => 'success',
                    'redirect' => '/home'
                ], 200);
            }

            return response()->json(['error' => 'unauthorized'], 401);
        } catch (\Exception $e) {
            Log::info("Errors", ['Error 1' => $e]);
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        if(Auth::guard('web')->check()) {
            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();

            return inertia('Login');
        }
    }
}