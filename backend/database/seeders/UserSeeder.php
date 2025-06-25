<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@test.test'],
            [
                'name' => 'Admin Test',
                'email' => 'admin@test.test',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );
    }
}
