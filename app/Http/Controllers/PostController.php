<?php

namespace App\Http\Controllers;

use App\Models\Media;
use App\Models\Post;
use App\Models\User;
use App\Models\UserProfile;
use CloudinaryLabs\CloudinaryLaravel\Facades\Cloudinary;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class PostController extends Controller
{
    function create(Request $request) {
        try {
            DB::beginTransaction();

            $request->validate([
                'text' => 'required|string|max:280'
            ]);

            $userId = Auth::id();
            $user = User::with('profile')->findOrFail($userId);

            $profile = $user->profile;
            $profileId = $profile->id;

            $post = Post::create([
                'user_profile_id' => $profileId,
                'original_post_id' => null,
                'parent_post_id' => $request->input('parent'),
                'post_text' => $request->input('text')
            ]);

            $postId = $post->id;

            if(!$request->hasFile('files')) {
                DB::commit();
                return response()->json(['Successfully created']);
            };

            $request->validate([
                'file.*' => 'required|file|mimes:jpg,jpeg,png,gif,mp4,mkv,avi|max:30000'
            ]);

            $files = $request->file('files');
            Log::info('files', ['files' => $files]);
            //Cloudinary Case

            // foreach ($files as $idx => $file) {
            //     $uploadedImg = cloudinary()->uploadApi()->upload(
            //         $file->getRealPath(), 
            //         [
            //             'folder' => 'uploads',
            //             'transformation' => 
            //             [
            //                 'quality' => 'auto',
            //                 'fetch_format' => 'auto',
            //             ]
            //         ]
            //     );

            //     $mimeType = $file->getMimeType();
            //     $order = $idx;
            //     $fileUrl = $uploadedImg['secure_url'];
            //     $publicId = $uploadedImg['public_id'];

            //     Media::create([
            //         'url' => $fileUrl,
            //         'mimeType' => $mimeType,
            //         'order' => $order,
            //         'public_id' => $publicId,
            //         'post_id' => $postId
            //     ]);
            // }

            //Storage Case

            foreach ($files as $idx => $file) {
                $filePath = $file->store('posts', 'public');
                $mimeType = $file->getMimeType();
                $mimeType = $file['mimeType'];
                $order = $idx;
                $publicId = null;
                Log::info('result', ['Archivo Subido' => $filePath]);

                Media::create([
                    'url' => $filePath,
                    'mimeType' => $mimeType,
                    'order' => $order,
                    'public_id' => $publicId,
                    'post_id' => $postId
                ]);
            }
            

            DB::commit();
            return response()->json(['Successfully created']);
        } catch (ValidationException $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => 'A validation error has occurred',
                'error' => $e
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::info('Error', ['error' => $e]);

            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e
            ], 500);
        }
    }

    function index() {
        try {
            $posts = Post::with(['userProfile', 'media'])
            ->withCount([
                'likedBy as likes', 
                'replies as replies', 
                'repost as reposts',
                'userProfile.followers as followers',
                'userProfile.following as following'
                ])
            ->latest()
            ->paginate(10);

            return response()->json($posts);
        } catch (\Exception $e) {
            Log::info('Error', ['error' => $e]);

            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e
            ], 500);
        }
    }

    function getPost(Request $request) {
        try {
            $postId = $request->get('postId');
            $post = Post::with(['userProfile:id,name,username,avatar', 'media'])
                ->withCount('likedBy as likes', 'replies as replies', 'repostedBy as reposts')
                ->findOrFail($postId);

            $post->append('liked_by_cur_profile');
            $post->append('reposted_by_cur_profile');
            $post->append('bookmarked_by_cur_profile');

            return response()->json($post);
        } catch (\Exception $e) {
            Log::warning('something went wrong', ['Something:' => $e]);
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e
            ], 500);
        }
    }
    function getReplies(Request $request) {
        try {
            $postId = $request->get('postId');

            $replies = Post::with(['userProfile:id,name,username,avatar', 'media'])
              ->withCount(['likedBy as likes', 'replies as replies', 'repostedBy as reposts'])
              ->where('parent_post_id', $postId)
              ->get();;

            foreach ($replies as $reply) {
                $reply->append('liked_by_cur_profile');
                $reply->append('reposted_by_cur_profile');
                $reply->append('bookmarked_by_cur_profile');
            }

            return response()->json($replies);
        } catch (\Exception $e) {
            Log::warning('something went wrong', ['Something:' => $e]);
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e
            ], 500);
        }
    }

    function quote($postId) {
        try {
            $post = Post::with(['userProfile:id,name,username,avatar', 'media'])->findOrFail($postId);
        
            return response()->json($post);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e
            ], 500);
        }
    }

    function like(Request $request) {
        try {
            $userId = Auth::id();
            $user = User::with('profile')->findOrFail($userId);

            $profile = $user->profile;
            $postId = $request->postId;

            $post = Post::findOrFail($postId);

            if($profile->hasLikedPost($post)) {
                $profile->likeTo()->detach($post);

                return response()->json(['message' => 'Like removed'], 200);
            }

            $profile->likeTo()->attach($post);

            return response()->json(['message' => 'Liked'], 200);
        } catch (\Throwable $e) {
            Log::error('error', ['error this time:' => $e]);
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e
            ], 500);
        }
    }

    function bookmark(Request $request) {
        try {
            $userId = Auth::id();
            $user = User::with('profile')->findOrFail($userId);

            $profile = $user->profile;
            $postId = $request->postId;

            $post = Post::findOrFail($postId);

            if($profile->hasBookmark($post)) {
                $profile->bookmarks()->detach($post);

                return response()->json(['message' => 'bookmark removed'], 200);
            }

            $profile->bookmarks()->attach($post);

            return response()->json(['message' => 'Bookmarked'], 200);
        } catch (\Throwable $e) {
            Log::error('error', ['error this time:' => $e]);
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e
            ], 500);
        }
    }
    function repost(Request $request) {
        try {
            $userId = Auth::id();
            $user = User::with('profile')->findOrFail($userId);

            $profile = $user->profile;
            $postId = $request->postId;

            $post = Post::findOrFail($postId);

            if($profile->hasReposted($post)) {
                $profile->reposts()->detach($post);

                return response()->json(['message' => 'Repost removed'], 200);
            }

            $profile->reposts()->attach($post);

            return response()->json(['message' => 'Reposted'], 200);
        } catch (\Throwable $e) {
            Log::error('error', ['error this time:' => $e]);
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e
            ], 500);
        }
    }

    function destroy($postId) {
        try {
            $post = Post::findOrFail($postId);
            $post->delete();
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Internal server error',
                'error' => $e
            ], 500);
        }
    }
}