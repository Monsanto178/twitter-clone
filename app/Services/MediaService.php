<?php

namespace App\Services;

use App\Models\Media;
use App\Models\Post;
use App\Models\User;
use App\Models\UserProfile;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class MediaService
{
    /**
     * Create a new class instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * 
     * @param array $files
     * @param Post $post
     * 
     * @return void
     * @throws Exception
     */
    public function createMedia($files, $post) {

        foreach ($files as $file) {
            if (!$file instanceof \Illuminate\Http\UploadedFile) {
                throw new ValidationException('The file is not valid.');
            }

            if (!in_array($file->getClientOriginalExtension(), ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mkv', 'avi'])) {
                throw new ValidationException('The file type is not supported.');
            }

            if ($file->getSize() > 10000000) {
                throw new ValidationException('The file exceeds the maximum allowed size (30 MB).');
            }

            if (count($files) > 4) {
                throw new ValidationException('You can only upload a maximum of 4 files.');
            }

            try {
                //Cloudinary case

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
                //     $order = array_search($file, $files);
                //     $fileUrl = $uploadedImg['secure_url'];
                //  //   $publicId = $uploadedImg['public_id'];

                //     Media::create([
                //         'url' => $fileUrl,
                //         'mimeType' => $mimeType,
                //         'order' => $order,
                //  //       'public_id' => $publicId,
                //         'post_id' => $postId
                //     ]);


                //Storage case
                $filePath = $file->store('posts', 'public');
                $mimeType = $file->getMimeType();
                $order = array_search($file, $files);

                Media::create([
                    'url' => $filePath,
                    'mimeType' => $mimeType,
                    'order' => $order,
                    'post_id' => $post->id
                ]);
            } catch (Exception $e) {
                Log::error('Error processing media file: ' . $e->getMessage());
                throw new Exception('Error processing media files. Please try again later.', 500);
            }
        }
    }
}
