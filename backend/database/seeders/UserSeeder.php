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
            ['email' => 'admin@ubaq.test'],
            [
                'name' => 'Admin UBAQ',
                'email' => 'admin@ubaq.test',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );
    }
}
