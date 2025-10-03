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

    function user() {
        return $this->belongsTo(User::class, 'user_id');
    }
    function likeTo() {
        return $this->belongsToMany(Post::class, 'likes');
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
        return $this->hasMany(Post::class, 'parent_post_id');
    }

    public function hasLikedPost(Post $post){
        return $this->likeTo()->contains($post);
    }
    public function hasReposted(Post $post){
        return $this->repostedPosts->contains($post);
    }
    public function hasRepliedToPost(Post $post){
        return $this->replies->contains($post);
    }

    public function followers() {
        return $this->belongsToMany(UserProfile::class, 'follow_users', 'following_id', 'follower_id');
    }
    public function following() {
        return $this->belongsToMany(UserProfile::class, 'follow_users', 'follower', 'following_id');
    }

    public function isFollowing(UserProfile $user) {
        return $this->following()->contains($user);
    }
    public function isFollowedBy(UserProfile $user) {
        return $this->followers()->contains($user);
    }
}
