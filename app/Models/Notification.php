<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'type',
        'recipient_id',
        'user_count',
        'post_id'
    ];

    public function recipient(): BelongsTo{
        return $this->belongsTo(UserProfile::class, 'recipient_id');
    }
    public function post(): BelongsTo{
        return $this->belongsTo(Post::class);
    }
    public function actors(): BelongsToMany{
        return $this->belongsToMany(UserProfile::class, 'notification_user');
    }


    public function isRead(): bool{
        return $this->read;
    }

    public function previewActors($limit = 3){
        return $this->actors()
            ->limit($limit)
            ->get()
            ->pluck('name')
            ->toArray();
    }
}
