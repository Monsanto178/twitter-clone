<?php

namespace App\Services;

use App\Models\Post;
use App\Models\UserProfile;
use Exception;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ProfileService
{
    private int $perPage = 2;

    public function setPostPerPage(int $value) {
        $this->perPage = $value;
    }

    public function __construct()
    {
        //
    }

    private function handleErrors(ValidationException | Exception $e, int $code = 500, string $message): array {
        return [
            'status' => 'error',
            'code' => $code,
            'message' => $message,
            'error' => $e->getMessage()
        ];
    }
    private function handleResponse(string $message, int $code = 200, ?array $data = null): array {
        return [
            'status' => 'success',
            'code' => $code,
            'message' => $message,
            'data' => $data
        ];
    }

    private function addAttributes($posts) {
        foreach ($posts as $post) {
            $post->append('liked_by_cur_profile');
            $post->append('reposted_by_cur_profile');
            $post->append('bookmarked_by_cur_profile');
        }
    }

    private function handleReturnPagedArr(\Illuminate\Pagination\LengthAwarePaginator | \Illuminate\Database\Eloquent\Collection $posts): array {
        $data = [
            'posts' => $posts->items(),
            'stats' => [                
                'current_page' => $posts->currentPage(),
                'total' => $posts->total(),
                'last_page' => $posts->lastPage()
            ],
        ];

        return $data;
    }

    /**
     * 
     * @param string $profileId
     * 
     * @return array
     */

    public function getProfile(string $profileId): array {
        try {
            if(!is_numeric($profileId)) {
                throw new ValidationException("Error. Id must be numeric.");
            }

            $currentProfile = Auth::user()->profile;

            $profile = UserProfile::withCount(['followers as followers', 'following as following'])
                ->findOrFail($profileId);

            $isFollowing = $profile->isFollowing($currentProfile);
            $isFollowed = $profile->isFollowedBy($currentProfile);
            $ownProfile = $currentProfile->id == $profileId ? true : false;

            $data = [
                'profile' => $profile,
                'isFollowing' => $isFollowing,
                'isFollowed' => $isFollowed,
                'own_profile' => $ownProfile
            ];

            return $this->handleResponse('Profile retrieved successfully', 200, $data);
        } catch (ValidationException $e) {

            return $this->handleErrors($e, 422, 'Validation error');
        } catch (\Exception $e) {

            return $this->handleErrors($e, 500, 'Internal server error');
        }
    }

    public function getUsername(int $postId):array {
        try {
            if(!is_numeric($postId)) {
                throw new ValidationException("Error. Id must be numeric.");
            }

            $post = Post::with('userProfile')->findOrFail($postId);
            $username = $post->userProfile->username;
            $profileId = $post->userProfile->id;
            $data = [
                'username' => $username,
                'profileId' => $profileId
            ];
            
            return $this->handleResponse('Success', 200, $data);
        } catch (ValidationException $e) {

            return $this->handleErrors($e, 422, 'Validation error');
        } catch (\Exception $e) {

            return $this->handleErrors($e, 500, 'Internal server error');
        }
    }

    /**
     * @param string $profileId
     * 
     * @return array
     */

    function followProfile(string $profileId): array {
        try {
            if(!is_numeric($profileId)) {
                throw new ValidationException("Error. Id must be numeric.");
            }

            $currentProfile = Auth::user()->profile;
            $targetProfile = UserProfile::findOrFail($profileId);

            if($currentProfile->id === $targetProfile->id) {

                throw new Exception("You cannot follow yourself", 409);     
            }

            if($currentProfile->isFollowing($targetProfile)) {
                $currentProfile->following()->detach($targetProfile);
                
                return $this->handleResponse('Unfollow', 200);
            }

            $currentProfile->following()->attach($targetProfile);

            return $this->handleResponse('Follow', 200);
        } catch (ValidationException $e) {

            return $this->handleErrors($e, 422, 'Validation error');
        } catch (\Throwable $e) {

            return $this->handleErrors($e, 500, 'Internal server error');
        }
    }

    /**
     * @param string $profileId
     * 
     * @return array
     */
    function profilePosts(string $profileId): array {
        $profile = UserProfile::findOrFail($profileId);

        try {
            if(!is_numeric($profileId)) {
                throw new ValidationException("Error. Id must be numeric.");
            }
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
        
            $unionPosts = $posted
                ->union($reposted)
                ->union($quoted)
                ->orderBy('created_at', 'desc')
                ->paginate($this->perPage);

            $this->addAttributes($unionPosts);
            
            $data = $this->handleReturnPagedArr($unionPosts);

            return $this->handleResponse('Post retrieved successfully', 200, $data);
        } catch (ValidationException $e) {

            return $this->handleErrors($e, 422, 'Validation error');
        } catch (\Exception $e) {

            return $this->handleErrors($e, 500, 'Internal server error');
        }
    }

    /**
     * @param string $profileId
     * 
     * @return array
     */
    function profileReplies(string $profileId): array {
        try {
            if(!is_numeric($profileId)) {
                throw new ValidationException("Error. Id must be numeric.");
            }
            $replies = Post::with(['userProfile', 'media'])
            ->withCount(
                'likedBy as likes', 
                'replies as replies', 
                'repostedBy as reposts')
            ->where('user_profile_id', $profileId)
            ->whereNotNull('parent_post_id')
            ->paginate($this->perPage);

            $parentPostIds = $replies->pluck('parent_post_id')->unique();

            $originalPosts = Post::with(['userProfile', 'media'])
                ->withCount([                    
                    'likedBy as likes',
                    'replies as replies',
                    'repostedBy as reposts'])
                ->whereIn('id', $parentPostIds)
                ->get();
            
            $this->addAttributes($originalPosts);
            
            foreach ($replies as $reply) {
                $reply->originalPost = $originalPosts->firstWhere('id', $reply->parent_post_id);
            }

            $this->addAttributes($replies);

            $data = $this->handleReturnPagedArr($replies);


            return $this->handleResponse('Replies retrieved successfully', 200, $data);
        } catch (ValidationException $e) {
            
            return $this->handleErrors($e, 422, 'Validation error');
        } catch (\Exception $e) {

            return $this->handleErrors($e, 500, 'Internal server error');
        }
    }

    /**
     * @param string $profileId
     * 
     * @return array
     */
    function profileLikes(string $profileId): array {
        try {
            if(!is_numeric($profileId)) {
                throw new ValidationException("Error. Id must be numeric.");
            }
            $profile = UserProfile::findOrFail($profileId);

            $likes = $profile->likeTo()
            ->with(['userProfile', 'media'])
            ->withCount(
                'likedBy as likes', 
                'replies as replies', 
                'repostedBy as reposts')
            ->paginate($this->perPage);
            
            $this->addAttributes($likes);

            $data = $this->handleReturnPagedArr($likes);

            return $this->handleResponse('Liked posts retrieved successfully', 200, $data);
        } catch (ValidationException $e) {

            return $this->handleErrors($e, 422, 'Validation error');
        } catch (\Exception $e) {

            return $this->handleErrors($e, 500, 'Internal server error');
        }
    }

    /**
     * @param string $profileId
     * 
     * @return array
     */
    function profileMedia(string $profileId): array {
        try {
            if(!is_numeric($profileId)) {
                throw new ValidationException("Error. Id must be numeric.");
            }
            $postMedia = Post::with(['userProfile', 'media'])
            ->withCount(
                'likedBy as likes', 
                'replies as replies', 
                'repostedBy as reposts')
            ->where('user_profile_id', $profileId)
            ->whereHas('media')
            ->paginate($this->perPage);

            $this->addAttributes($postMedia);

            $data = $this->handleReturnPagedArr($postMedia);

            return $this->handleResponse('Post media retrieved successfully', 200, $data);
        } catch (ValidationException $e) {

            return $this->handleErrors($e, 422, 'Validation error');
        } catch (\Exception $e) {

            return $this->handleErrors($e, 500, 'Internal server error');
        }
    }

    /**
     * @param string $profileId
     * 
     * @return array
     */
    function profileBookMark(string $profileId): array {
        try {
            if(!is_numeric($profileId)) {
                throw new ValidationException("Error. Id must be numeric.");
            }
            $profile = UserProfile::findOrFail($profileId);

            $bookmarks = $profile->bookmarks()
            ->with(['userProfile', 'media'])
            ->withCount(
                'likedBy as likes', 
                'replies as replies', 
                'repostedBy as reposts')
            ->paginate($this->perPage);

            $this->addAttributes($bookmarks);

            $data = $this->handleReturnPagedArr($bookmarks);

            return $this->handleResponse('Bookmarks retrieved successfully', 200, $data);
        } catch (ValidationException $e) {

            return $this->handleErrors($e, 422, 'Validation error');
        } catch (\Exception $e) {

            return $this->handleErrors($e, 500, 'Internal server error');
        }
    }

    function profileUpdate(array $data, UploadedFile | null $avatar = null, UploadedFile | null $banner = null):array {
        $avatarPath = '';
        $bannerPath = '';
        $profile = Auth::user()->profile;
        $validation = Validator::make($data, [
            'name' => 'nullable|string|max:20',
            'bio' => 'nullable|string|max:285',
        ]);

        if($validation->fails()) {
            throw new ValidationException("Validation error.");
        }

        try {
            DB::beginTransaction();
            if($avatar) {
                $avatarValidation = Validator::make(['avatar' => $avatar], 
                    ['avatar' => 'nullable|image|mimes:jpeg,png,jpg,svg,webp|max:3072|file']
                );
                if($avatarValidation->fails()) { throw new ValidationException("Validation error"); };

                $avatarPath = $avatar->store('avatars', 'public');
                $data['avatar'] = Storage::url($avatarPath);
            };
            if($banner) {
                $bannerValidation = Validator::make(
                    ['banner' => $banner], ['banner' => 'nullable|image|mimes:jpeg,png,jpg,svg,webp|max:3072|file']
                );
                if($bannerValidation->fails()) { throw new ValidationException("Validation error");};

                $bannerPath = $banner->store('banners', 'public');
                $data['banner'] = Storage::url($bannerPath);
            };
            $toUpdate = array_filter($data, fn($val) => !is_null($val));
            $profile->update($toUpdate);
            DB::commit();

            return $this->handleResponse('Profile updated', 200);
        } catch (ValidationException $e) {
            DB::rollBack();

            return $this->handleErrors($e, 422, 'Validation error');
        } catch (\Exception $e) {
            DB::rollBack();

            return $this->handleErrors($e, 500, 'Internal server error');
        }
    }

    /**
     * 
     * @return array
     */
    function testProfiles(): array {
        try {
            $users = UserProfile::select('id', 'name', 'username', 'user_id', 'avatar')
                ->limit(3)
                ->get();

            return $this->handleResponse('Test Profiles retrieved successfully', 200, $users->toArray());
        } catch (\Exception $e) {

            return $this->handleErrors($e, 500, 'Internal server error');
        }
    }

    /**
     * 
     * @return array
     */
    function profilePicture(): array {
        try {
            $profilePic = Auth::user()->profile->avatar;
            $data = ['avatar' => $profilePic];

            return $this->handleResponse('Profile picture retrieved successfully', 200, $data);
        } catch (\Exception $e) {

            return $this->handleErrors($e, 500, 'Internal server error');
        }
    }
}
