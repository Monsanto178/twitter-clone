<?php

namespace Database\Seeders;

use App\Models\Media;
use App\Models\Post;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $avatars = [];

        for ($i=1; $i < 20; $i++) {
            $avatars[] = "/images/avatars/avatar_" . str_pad($i, 2, "0", STR_PAD_LEFT) . ".webp" ;
        }

        User::factory(5)->create()->each(function ($user) use ($avatars) {
            $avatar = $avatars[array_rand($avatars)];
            $profile= UserProfile::factory()->create([
                'user_id' => $user->id,
                'avatar' => $avatar
            ]);

            $posts = Post::factory(4)->create([
                'user_profile_id' => $profile->id
            ]);

            foreach($posts as $post) {
                $this->attachMedia($post);
            }
        });

    }

    function attachMedia(Post $post) {
        $media_urls = [];

        for ($i=1; $i < 49; $i++) {
            if ($i < 47) {
                $media_urls[] = "/images/media/img_example_" . str_pad($i, 2, "0", STR_PAD_LEFT) . ".webp" ;
            }
            
            if ($i > 46) {
                $media_urls[] = "/images/media/img_example_" . str_pad($i, 2, "0", STR_PAD_LEFT) . ".gif" ;
            }
        }

        for ($i=1; $i < 5; $i++) {
            $media_urls[] = "/images/media/video_example_" . str_pad($i, 2, "0", STR_PAD_LEFT) . ".webm" ;
        }

        $num_of_media = rand(0, 4);

        for ($i = 0; $i < $num_of_media; $i++) {
            $randIdx = array_rand($media_urls);
            $url = $media_urls[$randIdx];
            $imgType = $randIdx > 46 ? 'gif' : 'webp';
            
            $mimeType = str_contains($url, 'video') ? 'video/webm' : "image/$imgType";

            Media::create([
                'url' => $url,
                'mimeType' => $mimeType,
                'order' => $i,
                'post_id' => $post->id
            ]);
        }
    }
}
