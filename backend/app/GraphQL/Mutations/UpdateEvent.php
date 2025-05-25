<?php

namespace App\GraphQL\Mutations;

use App\Models\Event;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Auth;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class UpdateEvent
{
    /**
     * Mettre à jour un événement
     */
    public function __invoke($_, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        // $user = Auth::user();

        // if (! $user) {
        //     throw new \Exception('Utilisateur non authentifié.');
        // }

        // Récupérer l'événement
        $event = Event::findOrFail($args['id']);

        // Vérifications de sécurité selon le rôle
        // if ($user->role === 'user' && $event->created_by !== $user->id) {
        //     throw new \Exception('Vous n\'avez pas les droits pour modifier cet événement.');
        // }

        // Validation des données
        $input = $args['input'];

        // Vérification du budget si nécessaire
        if (isset($input['budget_used']) && $input['budget_used'] > ($input['budget_allocated'] ?? $event->budget_allocated)) {
            throw new \Exception('Le budget utilisé ne peut pas dépasser le budget alloué.');
        }

        // Mise à jour
        $event->update($input);

        // Recharger les relations
        $event->load(['doctor', 'laboratory']);

        return $event;
    }
}
