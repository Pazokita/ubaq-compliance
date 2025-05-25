<?php

namespace App\GraphQL\Mutations;

use App\Models\Event;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class DeleteEvent
{
    /**
     * Supprimer un événement
     */
    public function __invoke($_, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        // TEMPORAIRE : Désactiver l'auth pour debug
        // $user = Auth::user();

        // if (! $user) {
        //     throw new \Exception('Utilisateur non authentifié.');
        // }

        // Récupérer l'événement
        $event = Event::findOrFail($args['id']);

        // TEMPORAIRE : Désactiver les vérifications de sécurité
        // if ($user->role === 'user' && $event->created_by !== $user->id) {
        //     throw new \Exception('Vous n\'avez pas les droits pour supprimer cet événement.');
        // }

        // Les événements en cours ou validés ne peuvent être supprimés que par un admin
        // if (! $event->canBeDeleted() && $user->role !== 'admin') {
        //     throw new \Exception('Cet événement ne peut pas être supprimé dans son état actuel.');
        // }

        // Supprimer le fichier associé si existe
        if ($event->document_url && Storage::disk('public')->exists($event->document_url)) {
            Storage::disk('public')->delete($event->document_url);
        }

        // Supprimer l'événement
        $deleted = $event->delete();

        return $deleted;
    }
}
