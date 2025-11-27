<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserProfile;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        $user = User::create([
            'name' => 'Juan Rodriguez',
            'email' => 'juanrodri@example.com',
            'password' => Hash::make('password123'),
        ]);

        UserProfile::create([
            'name' => 'Juan Pérez',
            'username' => 'juanp',
            'avatar' => null,
            'banner' => null,
            'bio' => 'Desarrollador de Laravel y PHP',
            'user_id' => $user->id,
        ]);
        

        $user1 = User::create([
            'name' => 'Ana López',
            'email' => 'ana@example.com',
            'password' => Hash::make('password123'),
        ]);

        UserProfile::create([
            'name' => 'Ana López',
            'username' => 'ana_lopez',
            'avatar' => null,
            'banner' => null,
            'bio' => 'Frontend Developer con experiencia en Vue.js y React',
            'user_id' => $user1->id,
        ]);

        // Crear segundo usuario
        $user2 = User::create([
            'name' => 'Carlos Sánchez',
            'email' => 'carlos@example.com',
            'password' => Hash::make('password123'),
        ]);

        UserProfile::create([
            'name' => 'Carlos Sánchez',
            'username' => 'carlos_s',
            'avatar' => null,
            'banner' => null,
            'bio' => 'Desarrollador Full Stack, especializado en Laravel y Node.js',
            'user_id' => $user2->id,
        ]);

        // Crear tercer usuario
        $user3 = User::create([
            'name' => 'Lucía García',
            'email' => 'lucia@example.com',
            'password' => Hash::make('password321'),
        ]);

        UserProfile::create([
            'name' => 'Lucía García',
            'username' => 'luciag',
            'avatar' => null,
            'banner' => null,
            'bio' => 'Diseñadora UX/UI y desarrolladora web en constante aprendizaje',
            'user_id' => $user3->id,
        ]);
    }
}
