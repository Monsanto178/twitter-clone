<?php

namespace App\Http\Controllers;

use App\Services\ProfileService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    private ProfileService $profileService;

    public function __construct(ProfileService $profileService)
    {
        $this->$profileService = $profileService;
    }

    function getProfile(Request $request) {
        $profileId = $request->id;
        
        $profile = $this->profileService->getProfile($profileId);

        if($profile['status'] === 'error') {
            return response()->json([
                'status' => 'error',
                'message' => $profile['message'],
                'error' => $profile['error']
            ], $profile['code']);
        }

        return response()->json($profile['data'], 200);
    }

    function follow(Request $request) {
        $profileId = $request->id;
        
        $profile = $this->profileService->getProfile($profileId);

        if($profile['status'] === 'error') {
            return response()->json([
                'status' => 'error',
                'message' => $profile['message'],
                'error' => $profile['error']
            ], $profile['code']);
        }

        return response()->json(['Success'], 200);
    }

    function getProfilePosts(Request $request) {
        $profileId = $request->id;
        
        $posts = $this->profileService->profilePosts($profileId);

        if($posts['status'] === 'error') {
            return response()->json([
                'status' => 'error',
                'message' => $posts['message'],
                'error' => $posts['error']
            ], $posts['code']);
        }

        return response()->json($posts['data'], 200);
    }

    function getProfileReplies(Request $request) {
        $profileId = $request->id;
        
        $replies = $this->profileService->profileReplies($profileId);

        if($replies['status'] === 'error') {
            return response()->json([
                'status' => 'error',
                'message' => $replies['message'],
                'error' => $replies['error']
            ], $replies['code']);
        }

        return response()->json($replies['data'], 200);
    }
    
    function getProfileLikes(Request $request) {
        $profileId = $request->id;
        
        $likes = $this->profileService->profileLikes($profileId);

        if($likes['status'] === 'error') {
            return response()->json([
                'status' => 'error',
                'message' => $likes['message'],
                'error' => $likes['error']
            ], $likes['code']);
        }

        return response()->json($likes['data'], 200);
    }

    function getProfileMedia(Request $request) {
        $profileId = $request->id;
        
        $mediaPost = $this->profileService->profileMedia($profileId);

        if($mediaPost['status'] === 'error') {
            return response()->json([
                'status' => 'error',
                'message' => $mediaPost['message'],
                'error' => $mediaPost['error']
            ], $mediaPost['code']);
        }

        return response()->json($mediaPost['data'], 200);
    }

    function getProfileBookMark() {
        $profileId = Auth::user()->profile->id;
        
        $bookmarks = $this->profileService->profilePosts($profileId);

        if($bookmarks['status'] === 'error') {
            return response()->json([
                'status' => 'error',
                'message' => $bookmarks['message'],
                'error' => $bookmarks['error']
            ], $bookmarks['code']);
        }

        return response()->json($bookmarks['data'], 200);
    }
    
    function getTestProfiles() {
        $profileId = Auth::user()->profile->id;
        
        $testProf = $this->profileService->testProfiles($profileId);

        if($testProf['status'] === 'error') {
            return response()->json([
                'status' => 'error',
                'message' => $testProf['message'],
                'error' => $testProf['error']
            ], $testProf['code']);
        }

        return response()->json($testProf['data'], 200);
    }

    function getProfilePic() {
        $profileId = Auth::user()->profile->id;
        
        $profPic = $this->profileService->profilePicture($profileId);

        if($profPic['status'] === 'error') {
            return response()->json([
                'status' => 'error',
                'message' => $profPic['message'],
                'error' => $profPic['error']
            ], $profPic['code']);
        }

        return response()->json([
            'profilePic' => $profPic
        ]);
    }
}