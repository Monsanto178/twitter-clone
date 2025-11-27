<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\User;
use App\Models\UserProfile;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class ProfileController extends Controller
{

    function getProfile(Request $request) {
        try {
            $profileId = $request->id;
            
            $currentProfile = UserProfile::findOrFail($profileId);

            
            $profileId = $request->id;
            $profile = UserProfile::withCount(['followers as followers', 'following as following'])
                ->findOrFail($profileId);

            $isFollowing = $profile->isFollowing($currentProfile);
            $isFollowed = $profile->isFollowedBy($currentProfile);

            $ownProfile = $currentProfile->id === $profileId ? true : false;
            return response()->json([
                'profile' => $profile,
                'isFollowing' => $isFollowing,
                'isFollowed' => $isFollowed,
                'own_profile' => $ownProfile
            ]);
        } catch (\Exception $e) {
            Log::warning('something went wrong', ['Something:' => $e]);
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e
            ], 500);
        }
    }

    function follow(Request $request) {
        $user = Auth::user();
        $curProfId = $user->profile->id;

        $targetId = $request->id;
    
        if($curProfId === $targetId) {
            return response()->json([
                    'status' => 'error',
                    'message' => 'You cannot follow yourself'
            ], 409);
        }
        try {
            $profile = $user->profile;
            $targetProfile = UserProfile::findOrFail($targetId);

            if($profile->isFollowing($targetProfile)) {
                $profile->following()->detach($targetProfile);

                return response()->json(false);

            }
            $profile->following()->attach($targetProfile);

            return response()->json(true);
        } catch (\Exception $e) {
            Log::warning('something went wrong', ['Something:' => $e]);
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e
            ], 500);
        }
    }
    function getProfilePosts(Request $request) {
        $profileId = $request->id;
        $profile = UserProfile::findOrFail($profileId);

        try {
            $posted = Post::with(['userProfile', 'media'])
            ->withCount(
                'likedBy as likes', 
                'replies as replies', 
                'repostedBy as reposts')
            ->where('user_profile_id', $profile->id)
            ->addSelect(DB::raw("'post' as 'type'"));

            $reposted = Post::with(['userProfile', 'media'])
                ->withCount([
                    'likedBy as likes',
                    'replies as replies',
                    'repostedBy as reposts'
                ])
                ->whereIn('id', $profile->reposts()->pluck('post_id'))
                ->addSelect(DB::raw("'repost' as 'type'"));
        
            $quoted = Post::with(['userProfile', 'media'])
                ->withCount([
                    'likedBy as likes',
                    'replies as replies',
                    'repostedBy as reposts'
                ])
                ->whereIn('id', $profile->posts()->pluck('original_post_id'))
                ->addSelect(DB::raw("'quote' as 'type'"));

            $perPage = 2;
        
            $unionPosts = $posted
                ->union($reposted)
                ->union($quoted)
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);

            foreach ($unionPosts as $post) {
                $post->append('liked_by_cur_profile');
                $post->append('reposted_by_cur_profile');
                $post->append('bookmarked_by_cur_profile');
            }

            return response()->json([
                'posts' => $unionPosts->items(),
                'stats' => [                
                    'current_page' => $unionPosts->currentPage(),
                    'total' => $unionPosts->total(),
                    'last_page' => $unionPosts->lastPage()
                    ]
            ], 200);
        } catch (\Exception $e) {
            Log::warning('something went wrong', ['Something:' => $e]);
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e
            ], 500);
        }
    }

    function getProfileReplies(Request $request) {
        try {
            $perPage = 2;
            $profileId = $request->id;

            $replies = Post::with(['userProfile', 'media'])
                ->withCount([                    
                    'likedBy as likes',
                    'replies as replies',
                    'repostedBy as reposts'])
                ->where('user_profile_id', $profileId)
                ->whereNotNull('parent_post_id')
                ->paginate($perPage);

            $parentPostIds = $replies->pluck('parent_post_id')->unique();

            $originalPosts = Post::with(['userProfile', 'media'])
                ->withCount([                    
                    'likedBy as likes',
                    'replies as replies',
                    'repostedBy as reposts'])
                ->whereIn('id', $parentPostIds)
                ->get();
            
            foreach ($originalPosts as $post) {
                $post->append('liked_by_cur_profile');
                $post->append('reposted_by_cur_profile');
                $post->append('bookmarked_by_cur_profile');
            }

            foreach ($replies as $reply) {
                $reply->originalPost = $originalPosts->firstWhere('id', $reply->parent_post_id);
            }
            
            foreach ($replies as $post) {
                $post->append('liked_by_cur_profile');
                $post->append('reposted_by_cur_profile');
                $post->append('bookmarked_by_cur_profile');
            }

            Log::info('result', ['Profile Replies' => $replies->items()]);
            return response()->json([
                'posts' => $replies->items(),
                'stats' => [                
                    'current_page' => $replies->currentPage(),
                    'total' => $replies->total(),
                    'last_page' => $replies->lastPage()
                    ]
            ], 200);
        } catch (\Exception $e) {
            Log::warning('something went wrong', ['Something:' => $e]);
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e
            ], 500);
        }
    }
    
    function getProfileLikes(Request $request) {
        try {
            $perPage = 2;
            $profileId = $request->id;
            $profile = UserProfile::findOrFail($profileId);

            $likes = Post::with(['userProfile', 'media'])
                ->withCount([                    
                    'likedBy as likes',
                    'replies as replies',
                    'repostedBy as reposts'])
                ->whereIn('id', $profile->likeTo()->pluck('post_id'))
                ->paginate($perPage);
            
            foreach ($likes as $post) {
                $post->append('liked_by_cur_profile');
                $post->append('reposted_by_cur_profile');
                $post->append('bookmarked_by_cur_profile');
            }

            Log::info('result', ['Profile Replies' => $likes]);
            return response()->json([
                'posts' => $likes->items(),
                'stats' => [                
                    'current_page' => $likes->currentPage(),
                    'total' => $likes->total(),
                    'last_page' => $likes->lastPage()
                    ]
            ], 200);
        } catch (\Exception $e) {
            Log::warning('something went wrong', ['Something:' => $e]);
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e
            ], 500);
        }
    }

    function getProfileMedia(Request $request) {
        try {
            $perPage = 2;
            $profileId = $request->id;
            $profile = UserProfile::findOrFail($profileId);

            $likes = Post::with(['userProfile', 'media'])
                ->withCount([                    
                    'likedBy as likes',
                    'replies as replies',
                    'repostedBy as reposts'])
                ->whereIn('id', $profile->likeTo()->pluck('post_id'))
                ->paginate($perPage);
            
            foreach ($likes as $post) {
                $post->append('liked_by_cur_profile');
                $post->append('reposted_by_cur_profile');
                $post->append('bookmarked_by_cur_profile');
            }

            Log::info('result', ['Profile Replies' => $likes]);
            return response()->json([
                'posts' => $likes->items(),
                'stats' => [                
                    'current_page' => $likes->currentPage(),
                    'total' => $likes->total(),
                    'last_page' => $likes->lastPage()
                    ]
            ], 200);
        } catch (\Exception $e) {
            Log::warning('something went wrong', ['Something:' => $e]);
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e
            ], 500);
        }
    }

    function getProfileBookMark() {
        $user = Auth::user();
        $profileId = $user->profile->id;

        $perPage = 2;
        try {
            $profile = UserProfile::findOrFail($profileId);
            $bookmarks = $profile->bookmarks()
                ->with('userProfile', 'media')
                ->withCount([
                    'likedBy as likes',
                    'replies as replies',
                    'repostedBy as reposts'
                ])
                ->paginate($perPage);
                     
            foreach ($bookmarks as $post) {
                $post->append('liked_by_cur_profile');
                $post->append('reposted_by_cur_profile');
                $post->append('bookmarked_by_cur_profile');
            }

            return response()->json([
                'posts' => $bookmarks->items(),
                'stats' => [                
                    'current_page' => $bookmarks->currentPage(),
                    'total' => $bookmarks->total(),
                    'last_page' => $bookmarks->lastPage()
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::info("Errors", ['Error' => $e]);
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e
            ], 500);
        }
    }
    
    function getTestProfiles() {
        try {
            $users = UserProfile::select('id', 'name', 'username', 'user_id', 'avatar')
                ->limit(3)
                ->get();
            
            return response()->json($users);
        } catch (Exception $e) {
            Log::info("Errors", ['Error' => $e]);
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e
            ], 500);
        }
    }

    function getProfilePic() {
        try {
            $userId = Auth::id();
            $user = User::findOrFail($userId);

            $profilePic = $user->profile->avatar;
            return response()->json([
                'profilePic' => $profilePic
            ]);
        } catch (Exception $e) {
            Log::info("Errors", ['Error' => $e]);
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e
            ], 500);
        }
    }
}