import {Post} from '@/Components';
import {PostType} from '@/Types/PostType';

interface Props {
    post: PostType;
    reply: PostType;
}

export const ReplyThread = ({post, reply}: Props) => {
    return (
        <>
        <div className='relative flex flex-col items-start w-full'>
            <div className='absolute left-10 top-12 bottom-55 sm:bottom-55 md:bottom-55 w-[1.5px] bg-gray-400'></div>

            <div className='relative w-full'>
                <Post post={post} selected={false} showReply={true}/>
            </div>

            <div className='relative mt-4 ml-3 w-full'>
                <Post post={reply} selected={true} showReply={true}/>
            </div>
        </div>
        </>
    )
}