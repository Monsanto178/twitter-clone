<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('follow_users', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->foreignId('follower_id')->constrained('user_profiles')->onDelete('cascade');
            $table->foreignId('following_id')->constrained('user_profiles')->onDelete('cascade');
            $table->timestamps();

            $table->unique(['follower_id', 'following_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('follow_users');
    }
};
