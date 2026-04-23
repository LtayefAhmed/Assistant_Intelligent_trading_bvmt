<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\RefreshToken;
use App\Models\User;
use App\UserRole;
use Carbon\Carbon;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Auth\Events\Verified;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AuthController extends Controller
{
     public function register(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6|confirmed',
                'user_type' => 'required|in:beginner,trader,regulator',
                'risk_profile' => 'required|in:conservative,moderate,aggressive',
                'initial_capital' => 'required_if:user_type,beginner,trader|numeric|min:0',
                'phone' => 'required|string|max:20',
                'cin' => 'required|string|unique:users',
                'date_of_birth' => 'required|date|before:-18 years',
                'address' => 'required|string|max:500',
                'city' => 'required|string|max:100',
            ]);

            $userData = [
                'name' => $request->name,
                'email' => $request->email,
                'user_type' => $request->user_type,
                'risk_profile' => $request->risk_profile,
                'initial_capital' => $request->initial_capital ?? 0,
                'current_capital' => $request->initial_capital ?? 0,
                'phone' => $request->phone,
                'cin' => $request->cin,
                'date_of_birth' => $request->date_of_birth,
                'address' => $request->address,
                'city' => $request->city,
                'country' => 'Tunisia',
                'preferred_language' => $request->preferred_language ?? 'fr',
                'investment_experience' => $request->investment_experience ?? '',
                'investment_objective' => $request->investment_objective ?? '',
                'investment_horizon' => $request->investment_horizon ?? '',
                'password' => bcrypt($request->password)
            ];

            $user = User::create($userData);
            $user->sendEmailVerificationNotification();

            return response()->json([
                'message' => 'Inscription réussie. Veuillez vérifier votre email.',
                'user' => $user->makeHidden(['password', 'verification_token'])
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Échec de l\'inscription',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = JWTAuth::user();

        if (!$user->hasVerifiedEmail()) {
            Auth::logout();
            return response()->json([
                'message' => 'Please verify your email address before logging in.'
            ], 403);
        }

        if (!$user->is_active) {
            return response()->json(['error' => 'Account deactivated'], 403);
        }

        $refreshToken = JWTAuth::claims(['refresh' => true])->fromUser($user);
        $expiresAt = now()->addMinutes(config('jwt.refresh_ttl'));

        RefreshToken::create([
            'user_id' => $user->id,
            'token' => $refreshToken,
            'expires_at' => $expiresAt,
        ]);

        $access_token = cookie(
            'access_token',
            $token,
            config('jwt.ttl'),
            '/',
            'localhost',
            false,
            true,
            false,
            'Lax'
        );

        $refresh_token = cookie(
            'refresh_token',
            $refreshToken,
            config('jwt.refresh_ttl'),
            '/',
            'localhost',
            false,
            true,
            false,
            'Lax'
        );

        return response()->json([
            'user' => $user,
        ])->withCookie($access_token)->withCookie($refresh_token);
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            return response()->json(['error' => 'Refresh token not found'], 401);
        }

        $storedToken = RefreshToken::where('token', $refreshToken)
            ->where('expires_at', '>', now())
            ->first();

        if (!$storedToken) {
            return response()->json(['error' => 'Invalid or expired refresh token'], 401);
        }

        $user = User::find($storedToken->user_id);
        $storedToken->delete();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $newAccessToken = JWTAuth::fromUser($user);
        $newRefreshToken = JWTAuth::claims(['refresh' => true])->fromUser($user);
        $expiresAt = now()->addMinutes(config('jwt.refresh_ttl'));

        RefreshToken::create([
            'user_id' => $user->id,
            'token' => $newRefreshToken,
            'expires_at' => $expiresAt,
        ]);

        $access_token = cookie(
            'access_token',
            $newAccessToken,
            config('jwt.ttl'),
            '/',
            'localhost',
            false,
            true,
            false,
            'Lax'
        );

        $refresh_token = cookie(
            'refresh_token',
            $newRefreshToken,
            config('jwt.refresh_ttl'),
            '/',
            'localhost',
            false,
            true,
            false,
            'Lax'
        );

        return response()->json([
            'message' => 'Token refreshed successfully'
        ])->withCookie($access_token)->withCookie($refresh_token);
    }

    public function logout(Request $request)
    {
        try {
            $refreshToken = $request->cookie('refresh_token');
            if ($refreshToken) {
                RefreshToken::where('token', $refreshToken)->delete();
            }

            $token = $request->cookie('access_token');
            if ($token) {
                JWTAuth::setToken($token)->invalidate();
            }

            $access_token = cookie(
                'access_token',
                null,
                -1,
                '/',
                'localhost',
                false,
                true,
                false,
                'Lax'
            );

            $refresh_token = cookie(
                'refresh_token',
                null,
                -1,
                '/',
                'localhost',
                false,
                true,
                false,
                'Lax'
            );

            return response()->json([
                'message' => 'Successfully logged out'
            ])->withCookie($access_token)->withCookie($refresh_token);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to logout'], 500);
        }
    }

    public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'prenom' => 'sometimes|string|max:255',
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'sometimes|string|max:20',
            'address' => 'sometimes|string|max:500',
            'cin' => 'sometimes|string|max:50|unique:users,cin,' . $user->id,
            'company' => 'sometimes|string|max:255',
            'position' => 'sometimes|string|max:255',
            'industry' => 'sometimes|string|max:255',
            'website' => 'sometimes|url|max:255',
            'profile_picture' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            'resume' => 'sometimes|file|mimes:pdf,doc,docx,txt|max:5120', // 5MB max
            'remove_resume' => 'sometimes|boolean'
        ]);

        if ($request->hasFile('profile_picture')) {
            if ($user->profile_picture) {
                Storage::disk('public')->delete($user->profile_picture);
            }

            $path = $request->file('profile_picture')->store('profile-pictures', 'public');
            $validated['profile_picture'] = $path;
        }

        if ($request->hasFile('resume')) {
            if ($user->resume) {
                Storage::disk('public')->delete($user->resume);
            }
            $path = $request->file('resume')->store('resumes', 'public');
            $validated['resume'] = $path;
        } elseif ($request->has('remove_resume') && $request->get('remove_resume') === 'true' && $user->resume) {
            Storage::disk('public')->delete($user->resume);
            $validated['resume'] = null;
        }
        $user->update($validated);
        $userData = $user->toArray();
        if ($user->profile_picture) {
            $userData['profile_picture_url'] = asset('storage/' . $user->profile_picture);
        }
        if ($user->resume) {
            $userData['resume_url'] = asset('storage/' . $user->resume);
        }
        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $userData
        ]);
    }


    public function verify(Request $request)
    {
        $user = User::find($request->route('id'));

        if (!$user) {
            return redirect(env('FRONTEND_URL') . '/auth/verify-email?success=false&message=User not found');
        }

        if (!hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
            return redirect(env('FRONTEND_URL') . '/auth/verify-email?success=false&message=Invalid verification link');
        }

        if ($user->hasVerifiedEmail()) {
            return redirect(env('FRONTEND_URL') . '/auth/verify-email?success=true&message=Email already verified');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return redirect(env('FRONTEND_URL') . '/auth/verify-email?success=true&message=Email verified successfully');
    }

    public function resend(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email already verified'
            ], 200);
        }

        $user->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Verification link sent'
        ], 200);
    }

    public function forgot(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::where('email', $request->email)->first();
        if (!$user) {
            return response()->json([
                'message' => 'Aucun utilisateur trouvé avec cette adresse email.'
            ], 404);
        }
        try {
            $status = Password::sendResetLink(
                $request->only('email'),
                function ($user, $token) {
                    $user->sendPasswordResetNotification($token);
                }
            );
            return $status === Password::RESET_LINK_SENT
                ? response()->json([
                    'message' => 'Un lien de réinitialisation a été envoyé à votre adresse email.'
                ])
                : response()->json([
                    'message' => 'Impossible d\'envoyer le lien de réinitialisation. Veuillez réessayer.'
                ], 400);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue lors de l\'envoi de l\'email.'
            ], 500);
        }
    }

    public function reset(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'password' => 'required|min:6|confirmed',
        ]);

        try {
            $status = Password::broker()->reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user, $password) {
                    $user->forceFill([
                        'password' => Hash::make($password),
                        'remember_token' => Str::random(60),
                    ])->save();

                    event(new PasswordReset($user));
                    $this->deletePasswordResetToken($user->email);
                }
            );

            switch ($status) {
                case Password::PASSWORD_RESET:
                    return response()->json([
                        'message' => 'Votre mot de passe a été réinitialisé avec succès.'
                    ], 200);

                case Password::INVALID_TOKEN:
                    return response()->json([
                        'message' => 'Le lien de réinitialisation est invalide ou a expiré.'
                    ], 400);

                case Password::INVALID_USER:
                    return response()->json([
                        'message' => 'Aucun utilisateur trouvé avec cette adresse email.'
                    ], 400);

                default:
                    return response()->json([
                        'message' => 'Impossible de réinitialiser le mot de passe.'
                    ], 400);
            }
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Une erreur est survenue lors de la réinitialisation.'
            ], 500);
        }
    }

    protected function deletePasswordResetToken($email)
    {
        DB::table('password_reset_tokens')
            ->where('email', $email)
            ->delete();
    }

    public function verifyToken(Request $request)
    {
        $request->validate(['token' => 'required']);

        try {
            $tokens = DB::table('password_reset_tokens')
                ->where('created_at', '>', Carbon::now()->subHours(24))
                ->get();

            $validToken = null;
            foreach ($tokens as $tokenRecord) {
                if (Hash::check($request->token, $tokenRecord->token)) {
                    $validToken = $tokenRecord;
                    break;
                }
            }

            if (!$validToken) {
                return response()->json([
                    'valid' => false,
                    'message' => 'Lien de réinitialisation invalide ou expiré.'
                ], 404);
            }

            return response()->json([
                'valid' => true,
                'email' => $validToken->email,
                'message' => 'Lien de réinitialisation valide.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'valid' => false,
                'message' => 'Erreur lors de la vérification du lien.'
            ], 500);
        }
    }

    public function findEmailByToken(Request $request)
    {
        $request->validate(['token' => 'required']);

        $tokenData = DB::table('password_reset_tokens')
            ->where('token', $request->token)
            ->where('created_at', '>', Carbon::now()->subHours(24))
            ->first();

        if (!$tokenData) {
            return response()->json([
                'email' => null,
                'message' => 'Lien de réinitialisation invalide ou expiré.'
            ], 404);
        }

        return response()->json([
            'email' => $tokenData->email,
            'message' => 'Email trouvé avec succès.'
        ]);
    }
}
