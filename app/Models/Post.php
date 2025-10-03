<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_profile_id',
        'post_text',
        'original_post_id',
        'parent_post_id'
    ];

    public function userProfile() {
        return $this->belongsTo(UserProfile::class);
    }
    public function media() {
        return $this->hasMany(Media::class)->orderBy('order');
    }
    public function notifcations() {
        return $this->hasMany(Notification::class);
    }
    public function likedBy() {
        return $this->belongsToMany(UserProfile::class, 'likes');
    }
    public function replies() {
        return $this->hasMany(Post::class, 'parent_post_id');
    }
    public function parent() {
        return $this->belongsTo(Post::class, 'parent_post_id');
    }
    public function repost() {
        return $this->hasMany(Post::class, 'original_post_id');
    }
    public function originalPost() {
        return $this->belongsTo(Post::class, 'original_post_id');
    }

    function repliesCount() {
        return $this->replies()->count();
    }
    function likesCount() {
        return $this->likedBy()->count();
    }
    function repostsCount() {
        return $this->repost()->count();
    }
}