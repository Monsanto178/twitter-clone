<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Services\PostService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    private postService $postService;

    public function __construct(PostService $postService)
    {
       $this->postService = $postService;
    }

    function create(Request $request) {
        $data = $request->all();
        $data['profile_id'] = Auth::user()->profile->id;
        
        $createPost = $this->postService->createPost($data);

        if($createPost['status'] === 'error') {
            return response()->json([
                'status' => 'error',
                'message' => $createPost['message'],
                'error' => $createPost['error']
            ], $createPost['code']);
        }

        return response()->json([
            'status' => 'success',
            'message' => $createPost['message']
        ], 201);
    }

    function index() {
        $indexPosts = $this->postService->getHomePosts();

        if($indexPosts['status'] === 'error') {
            return response()->json([
                'status' => 'error',
                'message' => $indexPosts['message'],
                'error' => $indexPosts['error']
            ], $indexPosts['code']);
        }

        return response()->json($indexPosts['data'], 200);
    }

    function getPost(Request $request) {
        $postId = $request->input('postId');
        
        $post = $this->postService->getPost($postId);

        if($post['status'] === 'error') {
            return response()->json([
                'status' => 'error',
                'message' => $post['message'],
                'error' => $post['error']
            ], $post['code']);
        }

        return response()->json($post['data']['post'], 200);
    }

    function getReplies(Request $request) {
        $postId = $request->input('postId');
        
        $replies = $this->postService->getPostReplies($postId);

        if($replies['status'] === 'error') {
            return response()->json([
                'status' => 'error',
                'message' => $replies['message'],
                'error' => $replies['error']
            ], $replies['code']);
        }

        return response()->json($replies['data']['replies'], 200);
    }

    // function quote($postId) {
    //     try {
    //         $post = Post::with(['userProfile:id,name,username,avatar', 'media'])->findOrFail($postId);
        
    //         return response()->json($post);
    //     } catch (\Exception $e) {
    //         return response()->json([
    //             'status' => 'error',
    //             'message' => 'Internal server error',
    //             'error' => $e
    //         ], 500);
    //     }
    // }

    function like(Request $request) {
        $postId = $request->input('postId');
        
        $replies = $this->postService->likePost($postId);

        if($replies['status'] === 'error') {
            return response()->json([
                'status' => 'error',
                'message' => $replies['message'],
                'error' => $replies['error']
            ], $replies['code']);
        }

        return response()->json(['Success'], 200);
    }

    function bookmark(Request $request) {
        $postId = $request->input('postId');
        
        $replies = $this->postService->likePost($postId);

        if($replies['status'] === 'error') {
            return response()->json([
                'status' => 'error',
                'message' => $replies['message'],
                'error' => $replies['error']
            ], $replies['code']);
        }

        return response()->json(['Success'], 200);
    }
    function repost(Request $request) {
        $postId = $request->input('postId');
        
        $repost = $this->postService->repostPost($postId);

        if($repost['status'] === 'error') {
            return response()->json([
                'status' => 'error',
                'message' => $repost['message'],
                'error' => $repost['error']
            ], $repost['code']);
        }

        return response()->json(['Success'], 200);
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