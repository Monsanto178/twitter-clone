import { ReactNode, useEffect, useState } from "react";
import { ProfileToolTip, MediaModal, CommentBox } from "../index";

type Media = {
    data: string | null;
    mimeType: string;
}

type User = {
    cover_img: string;
    user_name: string;
    user_alias: string;
    biography?: string;
    following: number;
    followers: number;
    creation_date?: string;
}

type Post = User & {
    time_posted: string;
    post_text: string | null;
    comments: number;
    reposted: number;
    likes: number;
    media: Array<Media> | null
}

interface Props {
    post: Post;
}

export const Post = ({post}:Props) => {
    const [profileHover, setProfileHover] = useState(false);
    const [showToolTip, setShowToolTip] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMCommentOpen, setIsMCommentOpen] = useState(false);
    const [curMediaFocus, setCurMediaFocus] = useState(0);

    const handleMediaClick = (idx:number) => {
        setCurMediaFocus(idx);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    }

    const classifyMedia = (media:Media, idx:number):ReactNode => {
        if (!media.data) return;

        if(media.mimeType.startsWith('video/')) {
            return <video onClick={() => {handleMediaClick(idx)}} src={media.data} controls className="w-full h-full object-cover transition-all duration-300 ease-in-out hover:scale-110"></video>
        }
        if(media.mimeType.startsWith('image/')) {
            return <img onClick={() => {handleMediaClick(idx)}} src={media.data} alt="media_content" className="w-full h-full object-cover transition-all duration-300 ease-in-out hover:scale-110"/>
        }
    }

    const displayMedia = (mediaArr:Array<Media>) => {
        if(mediaArr.length<1) return;
        if(mediaArr.length%2 === 0) {
            return (
                <>
                {mediaArr.map((el, idx) => {
                    return (
                        <picture key={idx} className={`overflow-hidden bg-black w-[49%] flex items-center gap-1 ${mediaArr.length === 2 ? 'h-[25rem]' : 'h-[12.5rem]'}`}>
                            {classifyMedia(el, idx)}
                        </picture>
                    )
                })}
                </>
            )
        } else {
            return(
                <>
                <div className={`h-full flex items-center bg-black overflow-hidden ${mediaArr.length === 1 ? 'w-full' : 'w-[60%]'}`}>
                    <picture className="w-full h-full">
                        {classifyMedia(mediaArr[0], 0)}
                    </picture>
                </div>
                {mediaArr.length>1 &&
                    <div className="flex flex-col w-[39%] gap-1">
                    {mediaArr.map((el, idx) => {
                        if (idx !== 0) {
                            return (
                                <picture key={idx} className={`overflow-hidden bg-black h-[50%] flex items-center gap-1`}>
                                    {classifyMedia(el, idx)}
                                </picture>
                            )
                        }
                    })}
                    </div>
                }
                </>
            )
        }
    }

    useEffect(() => {
        let timer: number;

        if (profileHover) {
            setShowToolTip(true);
        } else {
            timer = setTimeout(() => {
                setShowToolTip(false);
            }, 300);
        }

        return () => clearTimeout(timer);
    }, [profileHover]);

    const userData: User = {
        cover_img: post.cover_img,
        user_name: post.user_name,
        user_alias: post.user_alias,
        biography: post.biography,
        following: post.following,
        followers: post.followers,
        creation_date: post.creation_date,
    }

    return(
        <article className="relative flex cursor-pointer hover:bg-[#81818124] px-4 py-2 transition-all duration-300 ease-in-out text-[15px] md:text-[16px]">
            <div className="relative h-[50px] pr-2" onMouseEnter={() => {setProfileHover(true)}} onMouseLeave={() => setProfileHover(false)}>
                <div className="relative w-[50px] h-[50px] rounded-[50%] overflow-hidden group">
                    <picture className="w-full h-full">
                        <img src={post.cover_img} alt="" className="w-full h-full" draggable={false}/>
                    </picture>
                    <div className="absolute top-0 w-full h-full bg-transparent group-hover:bg-[#16161633] transition-all duration-300 ease-in-out"></div>
                </div>

                <div className={`transition-all duration-300 ease-in-out ${profileHover ? 'opacity-100' : 'opacity-0'}`}>
                    {showToolTip && 
                        <ProfileToolTip user={userData}/>
                    }
                </div>
            </div>
            
            <div className="flex flex-col gap-y-2 w-[90%]">
                <div className="flex gap-x-4">
                    <a href="">
                        <strong>{post.user_name}</strong>
                    </a>
                    <a href="">
                        <span>{post.user_alias}</span>
                    </a>
                    <span>{post.time_posted}</span>
                </div>

                {post.post_text && 
                <div>
                    <p>{post.post_text}</p>
                </div>
                }

                {post.media && 
                <div className={`overflow-hidden items-strech rounded-[20px] justify-between gap-1 flex`}>
                    {displayMedia(post.media)}
                </div>
                }

                <div className="flex justify-between">
                    <button onClick={() => {setIsMCommentOpen(true); document.body.style.overflow = 'hidden';}} className="flex cursor-pointer transition-all duration-300 ease-in-out transfrom group items-center">
                        <div className="group-hover:bg-[#8a8a8a7d] transition-all duration-500 ease-in-out rounded-[50%] p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#E17564" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] md:h-[24px] md:w-[24px] lucide lucide-message-circle-icon lucide-message-circle"><path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/></svg>
                        </div>
                        <span>{post.comments}</span>
                    </button>
                    <div className="flex cursor-pointer transition-all duration-300 ease-in-out transfrom group items-center">
                        <div className="group-hover:bg-[#8a8a8a7d] transition-all duration-500 ease-in-out rounded-[50%] p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#E17564" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] md:h-[24px] md:w-[24px] lucide lucide-repeat-icon lucide-repeat"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
                        </div>
                        <span>{post.reposted}</span>
                    </div>
                    <div className="flex cursor-pointer transition-all duration-300 ease-in-out transfrom group items-center">
                        <div className="group-hover:bg-[#8a8a8a7d] transition-all duration-500 ease-in-out rounded-[50%] p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#E17564" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] md:h-[24px] md:w-[24px] lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>
                        </div>
                        <span>{post.likes}</span>
                    </div>
                    <div className="flex cursor-pointer transition-all duration-300 ease-in-out transfrom group items-center">
                        <div className="group-hover:bg-[#8a8a8a7d] transition-all duration-500 ease-in-out rounded-[50%] p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#E17564" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] md:h-[24px] md:w-[24px] lucide lucide-bookmark-icon lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                        </div>
                    </div>
                    <div className="flex cursor-pointer transition-all duration-300 ease-in-out transfrom group items-center">
                        <div className="group-hover:bg-[#8a8a8a7d] transition-all duration-500 ease-in-out rounded-[50%] p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#E17564" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] md:h-[24px] md:w-[24px] lucide lucide-share2-icon lucide-share-2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className={`transition-all duration-500 ease-in-out ${isModalOpen ? 'opacity-100' : 'opacity-0'}`}>
                {post.media && isModalOpen &&  <MediaModal mediaData={post.media} current={curMediaFocus} setOpenModal={setIsModalOpen}/>}
            </div>

            <div className={`transition-all duration-500 ease-in-out ${isMCommentOpen ? 'opacity-100' : 'opacity-0'}`}>
                {isMCommentOpen && 
                    <div onClick={() => {setIsMCommentOpen(false); document.body.style.overflow = 'auto';}} className="w-screen h-screen fixed inset-0 flex justify-center items-center">
                        <div className="fixed inset-0 bg-black opacity-85 w-screen h-screen"></div>
                        <div onClick={(e) => e.stopPropagation()} className="fixed bg-[#09122C] w-[95%] sm:w-[80%] max-w-[40rem] rounded-[20px]">
                            {<CommentBox cover_img={post.cover_img} replying={true} replyTo={post.user_alias}/>}
                            <button onClick={() => {setIsMCommentOpen(false); document.body.style.overflow = 'auto';}} className="absolute p-4 top-[-4rem] sm:top-[-3rem] sm:right-[-3rem] rounded-[50%] transition-all duration-300 ease-in-out hover:bg-[#87878770] cursor-pointer z-99">
                                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        </div>
                    </div>
                }
            </div>

        </article>
    )
}