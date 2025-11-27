import {Post} from '../Post/Post';
import {PostType} from '../../Types/PostType';

interface Props {
    post: PostType;
    reply: PostType;
}

export const Thread = ({post, reply}: Props) => {
    return (
        <>
        <div className='relative flex flex-col items-start w-full'>
            <div className='absolute left-10 top-12 bottom-27 sm:bottom-27 md:bottom-29 w-[2px] bg-gray-300'></div>

            <div className='relative w-full'>
                <Post post={post} selected={false}/>
            </div>

            <div className='relative mt-4 w-full'>
                <Post post={reply} selected={false}/>
            </div>
        </div>
        </>
    )
}