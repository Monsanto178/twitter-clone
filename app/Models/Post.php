<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

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

    public function bookmarks() {
        return $this->belongsToMany(UserProfile::class, 'bookmarks');
    }


    public function quotes() {
        return $this->hasMany(Post::class, 'original_post_id');
    }
    public function originalPost() {
        return $this->belongsTo(Post::class, 'original_post_id');
    }


    public function repostedBy() {
        return $this->belongsToMany(UserProfile::class, 'reposts', 'post_id', 'user_profile_id');
    }

    public function getLikedByCurProfileAttribute():bool {
        $profile = Auth::user()->profile;

        return $profile ? $profile->hasLikedPost($this) : false;
    }
    public function getRepostedByCurProfileAttribute():bool {
        $profile = Auth::user()->profile;

        return $profile ? $profile->hasReposted($this) : false;
    }
    public function getBookmarkedByCurProfileAttribute():bool {
        $profile = Auth::user()->profile;

        return $profile ? $profile->hasBookmark($this) : false;
    }

    function getRepliesCountAttribute() {
        return $this->replies()->count();
    }
    function getLikesCountAttribute() {
        return $this->likedBy()->count();
    }
    function getRepostsCountAttribute() {
        return $this->repostedBy()->count();
    }
}