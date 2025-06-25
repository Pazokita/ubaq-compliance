<?php

namespace App\GraphQL\Mutations;

use App\Models\Event;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Auth;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class ValidateEvent
{
    /**
     * Valider ou rejeter un événement
     */
    public function __invoke($_, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        $user = Auth::user();

        if (! $user) {
            throw new \Exception('Utilisateur non authentifié.');
        }

        if (! in_array($user->role, ['compliance', 'admin'])) {
            throw new \Exception('Vous n\'avez pas les droits pour valider des événements.');
        }
        $event = Event::findOrFail($args['id']);

        if (! $event->canBeValidated()) {
            throw new \Exception('Cet événement ne peut pas être validé dans son état actuel.');
        }

        $action = $args['action']; // 'VALIDATE', 'REJECT', 'REQUEST_MODIFICATION'
        $comment = $args['comment'] ?? null;

        // Logique de validation selon l'action
        switch ($action) {
            case 'VALIDATE':
                $newStatus = $this->getNextValidationStatus($event->status);
                break;

            case 'REJECT':
                $newStatus = Event::STATUS_REJECTED;
                break;

            case 'REQUEST_MODIFICATION':
                $newStatus = Event::STATUS_TO_MODIFY;
                break;

            default:
                throw new \Exception('Action de validation non reconnue.');
        }
        if ($user->role === 'compliance' && $event->exceedsBudgetThreshold() && $action === 'VALIDATE') {
            throw new \Exception('Le budget dépasse le seuil autorisé (250€). Validation admin requise.');
        }

        $event->update([
            'status' => $newStatus,
            'validation_comment' => $comment,
            'validated_by' => $user->id,
            'validated_at' => now(),
        ]);

        $event->load(['doctor', 'laboratory', 'validator']);

        return $event;
    }

    /**
     * Déterminer le prochain statut de validation
     */
    private function getNextValidationStatus(string $currentStatus): string
    {
        return match ($currentStatus) {
            Event::STATUS_PENDING => Event::STATUS_FIRST_VALIDATION,
            Event::STATUS_FIRST_VALIDATION => Event::STATUS_SECOND_VALIDATION,
            Event::STATUS_TO_MODIFY => Event::STATUS_FIRST_VALIDATION,
            default => throw new \Exception('Transition de statut invalide.')
        };
    }
}
