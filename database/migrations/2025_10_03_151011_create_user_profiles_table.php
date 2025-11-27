<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_profiles', function (Blueprint $table) {
            $table->id()->autoIncrement();
            $table->string('name');
            $table->string('username');
            $table->string('avatar')->nullable()->default(null);
            $table->string('banner')->nullable()->default(null);
            $table->text('bio')->nullable()->default(null);
            $table->timestamps();

            $table->foreignId('user_id')->constrained()->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_profiles');
    }
};
