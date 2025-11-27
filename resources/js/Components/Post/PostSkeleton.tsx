import Skeleton from "react-loading-skeleton"
import 'react-loading-skeleton/dist/skeleton.css';

export const PostSkeleton = () => {
    return (
        <article className="flex px-4 py-2 w-full">
            <div className="h-[50px] pr-2">
                <Skeleton width={'50px'} height={'50px'} style={{borderRadius:'50%', overflow:'hidden'}}/>
            </div>

            <div className="flex flex-col gap-y-2 w-[90%]">
                <div className="w-full flex gap-x-4">
                    <Skeleton height={'20px'} width={'100px'}/>
                    <Skeleton height={'20px'} width={'50px'}/>
                </div>

                <div className="w-full">
                    <Skeleton height={'15px'} width={'100%'} count={2}/>
                </div>

                <div className="w-full flex justify-between">
                    <Skeleton height={'24px'} width={'24px'} style={{borderRadius:'50%'}}/>
                    <Skeleton height={'24px'} width={'24px'} style={{borderRadius:'50%'}}/>
                    <Skeleton height={'24px'} width={'24px'} style={{borderRadius:'50%'}}/>
                    <Skeleton height={'24px'} width={'24px'} style={{borderRadius:'50%'}}/>
                    <Skeleton height={'24px'} width={'24px'} style={{borderRadius:'50%'}}/>
                </div>
            </div>
        </article>
    )
}