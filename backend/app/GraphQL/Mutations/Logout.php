<?php

namespace App\GraphQL\Mutations;

use Illuminate\Support\Facades\Auth;

class Logout
{
    public function __invoke($_, array $args)
    {
        // Vérification de l'authentification dans le resolver
        if (! Auth::check()) {
            throw new \Exception('Utilisateur non authentifié.');
        }

        // Logout de l'utilisateur
        $user = Auth::user();

        // Si tu utilises Sanctum
        if ($user->currentAccessToken()) {
            $user->currentAccessToken()->delete();
        }

        // Logout standard
        Auth::logout();

        return true;
    }
}
