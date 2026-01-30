<?php

namespace App\Services;

use App\Models\Post;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

use function Symfony\Component\Clock\now;

class PostService
{
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
    private function handleResponse(string $message, int $code = 200, \Illuminate\Pagination\LengthAwarePaginator|array|null|Post $data = null): array {
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

    /**
     * 
     *  @param array $data
     *  @return array
     *  @throws Exception
     */

    public function createPost(array $data): array {
        $textValidation = 'required|string|max:280';
        if(!empty($data['files'])) $textValidation = 'nullable|string|max:280';

        $validation = Validator::make($data, [
            'text' => $textValidation,
            'profile_id' => 'required|exists:user_profiles,id',
            'original_post_id' => 'nullable|exists:posts,id',
            'parent' => 'nullable|exists:posts,id'
        ]);
        if($validation->fails()) {
            throw new ValidationException("Validation error.");
        }
        
        try {
            DB::beginTransaction();

            $post = Post::create([
                'user_profile_id' => $data['profile_id'],
                'original_post_id' => null,
                'parent_post_id' => $data['parent'] ?? null,
                'post_text' => $data['text']
            ]);

            if(empty($data['files'])) {
                DB::commit();

                return $this->handleResponse('Post created successfully', 201);
            };


            $files = $data['files'];
            $mediaService = new MediaService();
            $mediaService->createMedia($files, $post);
            
            DB::commit();

            return $this->handleResponse('Post & Files created successfully', 201);
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

    public function getHomePosts():array {
        try {
            $posts = Post::with(['userProfile', 'media'])
            ->withCount([
                'likedBy as likes', 
                'replies as replies', 
                'repostedBy as reposts',
                ])
            ->latest()
            ->paginate(10);

            $this->addAttributes($posts);

            $parentPostIds = $posts->pluck('parent_post_id')->unique();

            $parents = Post::with(['userProfile:id,name,username,avatar', 'media'])
            ->withCount([
                'likedBy as likes', 
                'replies as replies', 
                'repostedBy as reposts',
                ])
            ->whereIn('id', $parentPostIds)
            ->get();

            if($parents->isEmpty()) return $this->handleResponse('Posts retrieved successfully', 200, $posts);
            
            $this->addAttributes($parents);

            foreach ($posts as $post) {
                $post->originalPost = $parents->firstWhere('id', $post->parent_post_id);
            }

            return $this->handleResponse('Posts retrieved successfully', 200, $posts);
        } catch (\Exception $e) {

            return $this->handleErrors($e, 500, 'Internal server error');
        }
    }

    /**
     * 
     * @param string $postId
     * 
     * @return array
     */

    public function getPost($postId): array {
        try {
            if(!is_numeric($postId)) {
                throw new ValidationException("Error. Id must be numeric.");
            }

            $post = Post::with(['userProfile:id,name,username,avatar', 'media'])
                ->withCount('likedBy as likes', 'replies as replies', 'repostedBy as reposts')
                ->findOrFail($postId);

            $post->append('liked_by_cur_profile');
            $post->append('reposted_by_cur_profile');
            $post->append('bookmarked_by_cur_profile');

            $data = ['post' => $post];

            return $this->handleResponse('Post & Files created successfully', 200, $data);
        } catch (ValidationException $e) {

            return $this->handleErrors($e, 422, 'Validation error');
        } catch (\Exception $e) {

            return $this->handleErrors($e, 500, 'Internal server error');
        }
    }

    /**
     * 
     * @param string $postId
     * 
     * @return array
     */

    public function getPostReplies($postId): array {
        try {
            if(!is_numeric($postId)) {
                throw new ValidationException("Error. Id must be numeric.");
            }

            $replies = Post::with(['userProfile:id,name,username,avatar', 'media'])
              ->withCount(['likedBy as likes', 'replies as replies', 'repostedBy as reposts'])
              ->where('parent_post_id', $postId)
              ->get();;

            foreach ($replies as $reply) {
                $reply->append('liked_by_cur_profile');
                $reply->append('reposted_by_cur_profile');
                $reply->append('bookmarked_by_cur_profile');
            }

            $data = ['replies' => $replies];
            return $this->handleResponse('Replies created successfully', 200, $data);
        } catch (ValidationException $e) {

            return $this->handleErrors($e, 422, 'Validation error');
        } catch (\Exception $e) {

            return $this->handleErrors($e, 500, 'Internal server error');   
        }
    }

    /**
     * @param string $postId
     * 
     * @return array
     */

    function likePost($postId): array {
        try {
            if(!is_numeric($postId)) {
                throw new ValidationException("Error. Id must be numeric.");
            }

            $profile = Auth::user()->profile;

            $post = Post::findOrFail($postId);

            if($profile->hasLikedPost($post)) {
                $profile->likeTo()->detach($post);

                return $this->handleResponse('Like removed', 200);
            }

            $profile->likeTo()->attach($post);

            return $this->handleResponse('Post liked successfully', 200);
        } catch (ValidationException $e) {

            return $this->handleErrors($e, 422, 'Validation error');
        } catch (\Throwable $e) {

            return $this->handleErrors($e, 500, 'Internal server error');
        }
    }

    /**
     * 
     * @param string $postId
     * 
     * @return array
     */
    function bookmarkPost($postId): array {
        try {
            if(!is_numeric($postId)) {
                throw new ValidationException("Error. Id must be numeric.");
            }

            $profile = Auth::user()->profile;

            $post = Post::findOrFail($postId);
            if($profile->hasBookmark($post)) {
                $profile->bookmarks()->detach($post);

                return $this->handleResponse('Bookmark removed', 200);
            }

            $profile->bookmarks()->attach($post);

            return $this->handleResponse('Bookmarked', 200);
        } catch (ValidationException $e) {

            return $this->handleErrors($e, 422, 'Validation error');
        } catch (\Exception $e) {

            return $this->handleErrors($e, 500, 'Internal server error');
        }
    }

        /**
     * 
     * @param string $postId
     * 
     * @return array
     */
    function repostPost($postId): array {
        try {
            if(!is_numeric($postId)) {
                throw new ValidationException("Error. Id must be numeric.");
            }

            $profile = Auth::user()->profile;

            $post = Post::findOrFail($postId);
            if($profile->hasReposted($post)) {
                $profile->reposts()->detach($post);

                return $this->handleResponse('Repost removed', 200);
            }

            $profile->reposts()->attach($post, ['created_at' => now()]);

            return $this->handleResponse('Successfully reposted', 200);
        } catch (ValidationException $e) {

            return $this->handleErrors($e, 422, 'Validation error');
        } catch (\Exception $e) {

            return $this->handleErrors($e, 500, 'Internal server error');
        }
    }
}
