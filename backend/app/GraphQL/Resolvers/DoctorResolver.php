<?php

namespace App\GraphQL\Resolvers;

class DoctorResolver
{
    /**
     * Concaténer le prénom et nom du médecin
     */
    public function name($root, array $args)
    {
        return trim($root->first_name.' '.$root->last_name);
    }
}
