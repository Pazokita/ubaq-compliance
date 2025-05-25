<?php

namespace App\GraphQL\Mutations;

use App\Models\Doctor;
use App\Models\Event;
use App\Models\Laboratory;
use GraphQL\Type\Definition\ResolveInfo;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Nuwave\Lighthouse\Support\Contracts\GraphQLContext;

class CreateEvent
{
    /**
     * Créer un nouvel événement
     */
    public function __invoke($_, array $args, GraphQLContext $context, ResolveInfo $resolveInfo)
    {
        // Vérifier l'authentification
        // $user = Auth::user();

        // if (! $user) {
        //     throw new \Exception('Utilisateur non authentifié.');
        // }
        // Utilisateur fictif pour les tests
        $userId = 1;

        // Validation des données d'entrée
        $validator = Validator::make($args, [
            'title' => 'required|string|max:255',
            'date' => 'required|date|after_or_equal:today',
            'location' => 'required|string|max:255',
            'type' => 'required|in:conference,workshop,formation,seminar,presentation',
            'description' => 'nullable|string|max:1000',
            'budget_allocated' => 'required|numeric|min:0',
            'budget_used' => 'nullable|numeric|min:0',
            'doctor_id' => 'required|exists:doctors,id',
            'laboratory_id' => 'required|exists:laboratories,id',
            'document_url' => 'nullable|url|max:500',
        ]);

        if ($validator->fails()) {
            throw new \Exception('Données invalides : '.$validator->errors()->first());
        }

        // Vérifier que le budget utilisé ne dépasse pas le budget alloué
        $budgetUsed = $args['budget_used'] ?? 0;
        if ($budgetUsed > $args['budget_allocated']) {
            throw new \Exception('Le budget utilisé ne peut pas dépasser le budget alloué.');
        }

        // Vérifier que le docteur existe
        $doctor = Doctor::find($args['doctor_id']);
        if (! $doctor) {
            throw new \Exception('Médecin introuvable.');
        }

        // Vérifier que le laboratoire existe
        $laboratory = Laboratory::find($args['laboratory_id']);
        if (! $laboratory) {
            throw new \Exception('Laboratoire introuvable.');
        }

        // Déterminer le statut initial
        $status = Event::STATUS_PENDING;

        // Selon la logique LEA : si budget par médecin > 250€, nécessite validation
        // Dans ce cas, 1 médecin par événement, donc budget_allocated = budget par médecin
        if ($args['budget_allocated'] > 250) {
            $status = Event::STATUS_FIRST_VALIDATION;
        }

        // Préparer les données pour la création
        $eventData = [
            'title' => $args['title'],
            'date' => $args['date'],
            'location' => $args['location'],
            'type' => $args['type'],
            'description' => $args['description'] ?? null,
            'budget_allocated' => $args['budget_allocated'],
            'budget_used' => $budgetUsed,
            'doctor_id' => $args['doctor_id'],
            'laboratory_id' => $args['laboratory_id'],
            'document_url' => $args['document_url'] ?? null,
            'status' => $status,
            // 'created_by' => $user->id,
            'created_by' => $userId,
        ];

        // Créer l'événement
        $event = Event::create($eventData);

        // Charger les relations pour la réponse GraphQL
        $event->load(['doctor', 'laboratory', 'validator', 'creator']);

        return $event;
    }
}
