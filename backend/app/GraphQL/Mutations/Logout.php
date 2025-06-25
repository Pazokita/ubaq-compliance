<?php

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\Auth;

class Logout
{
    public function __invoke($_, array $args)
    {
        if (! Auth::check()) {
            throw new \Exception('Utilisateur non authentifié.');
        }

        $user = Auth::user();

        if ($user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        Auth::logout();

        return true;
    }
}
