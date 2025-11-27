<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'username',
        'name',
        'bio',
        'avatar',
        'banner',
    ];

    public function posts(){
        return $this->hasMany(Post::class);
    }
    public function reposts() {
        return $this->belongsToMany(Post::class, 'reposts', 'user_profile_id', 'post_id');
    }
    public function bookmarks() {
        return $this->belongsToMany(Post::class, 'bookmarks');
    }
    function likeTo() {
        return $this->belongsToMany(Post::class, 'likes');
    }

    function user() {
        return $this->belongsTo(User::class, 'id');
    }

    public function notifications(){
        return $this->hasMany(Notification::class, 'recipient_id');
    }
    public function generatedNotifaction(){
        return $this->belongsToMany(Notification::class, 'notification_users');
    }
    public function repostedPosts(){
        return $this->hasMany(Post::class, 'original_post_id');
    }
    public function replies(){
        return $this->hasMany(Post::class, 'user_profile_id')->whereNotNull('parent_post_id');
    }

    public function hasLikedPost(Post $post):bool {
        return $this->likeTo()->where('post_id', $post->id)->exists();
    }
    public function hasReposted(Post $post){
        return $this->reposts()->where('post_id', $post->id)->exists();
    }
    public function hasRepliedToPost(Post $post){
        return $this->replies->contains($post);
    }
    public function hasBookmark(Post $post) {
        return $this->bookmarks()->where('post_id', $post->id)->exists();
    }

    public function followers() {
        return $this->belongsToMany(UserProfile::class, 'follow_users', 'following_id', 'follower_id');
    }
    public function following() {
        return $this->belongsToMany(UserProfile::class, 'follow_users', 'follower_id', 'following_id');
    }

    public function isFollowing(UserProfile $user) {
        return $this->following()->where('user_profiles.id', $user->id)->exists();
    }
    public function isFollowedBy(UserProfile $user) {
        return $this->followers()->where('user_profiles.id', $user->id)->exists();
    }
}