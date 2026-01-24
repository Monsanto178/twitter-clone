<?php

namespace Database\Factories;

use App\Models\UserProfile;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $random = $this->faker->randomDigit() * 10;
        return [
            'user_profile_id' => UserProfile::factory(),
            'post_text' => fake()->realText(110 + $random),
            'original_post_id' => null,
            'parent_post_id' => null
        ];
    }
}
