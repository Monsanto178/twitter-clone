import { useEffect, useState } from "react";
import { ProfileToolTip, MediaModal, CommentModal, DisplayMedia } from "../index";
import {PostType} from "../../Types";
import defaultAvatar from "../../../assets/user_avatar_default.png";
import NumberFlow from "@number-flow/react";
import { fetchData } from "../../Utils";
import { format, formatDistanceToNow, parseISO } from "date-fns";
import { router } from '@inertiajs/react';
// import { es } from 'date-fns/locale';

interface Props {
    post: PostType;
    selected: boolean;
}

export const Post = ({post, selected = false}:Props) => {
    const [profileHover, setProfileHover] = useState(false);
    const [showToolTip, setShowToolTip] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMCommentOpen, setIsMCommentOpen] = useState(false);
    const [curMediaFocus, setCurMediaFocus] = useState(0);

    const [isLiked, setIsLiked] = useState(post.liked_by_cur_profile);
    const [isAnimateLike, setIsAnimateLike] = useState(false);

    const [isRetuit, setIsRetuit] = useState(post.reposted_by_cur_profile);
    const [isAnimateRetuit, setIsAnimateRetuit] = useState(false);

    const [isBookmark, setIsBookmark] = useState(post.bookmarked_by_cur_profile);
    const [isAnimateBookmark, setIsAnimateBookmark] = useState(false);

    const [isAnimateShare, setIsAnimateShare] = useState(false);

    const [isAnimateReply, setIsAnimateReply] = useState(false);


    const handleMediaClick = (idx:number) => {
        setCurMediaFocus(idx);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    }
    
    const parseDate = (date:string, createdToNow:boolean) => {
        if(createdToNow) {
            const timeAgo = formatDistanceToNow(parseISO(date), {
                addSuffix: true,
                // locale: es,
            });
            
            return timeAgo;
        }
        
        if(!createdToNow) {
            const createdAt = format(parseISO(date), 'HH:mm dd MMM yy', {
                // locale: es,
            });

            return createdAt;
        }
    }

    async function sendRequest(route:string) {
        try {
            const formData = new FormData();
            formData.append('postId', post.id.toString());

            await fetchData<void>(route, "POST", formData);

        } catch (error) {
            console.error(error);
        }
    }

    const updateLikes = () => {
        if (post.liked_by_cur_profile) {
            return post.likes;
        }
        return post.likes;
    };
    const updateRepost = () => {
        if(post.reposted_by_cur_profile) {
            return post.reposts;
        }
        return post.reposts;
    };

    function like() {
        const route = '/api/likePost';

        sendRequest(route);
    }
    function repost() {
        const route = '/api/repostPost';

        sendRequest(route);
    }
    function bookmark() {
        const route = '/api/bookmarkPost';

        sendRequest(route);
    }

    const handleReplyBtn = () => {
        setIsAnimateReply(true);
        setTimeout(() => {
            setIsAnimateReply(false);
        }, 200);
    }
    const handleRetuitBtn = () => {
        if(isRetuit) {
            post.reposts -= 1;
        } else {
            post.reposts += 1;
        }

        repost();
        setIsRetuit(prev => !prev);
        setIsAnimateRetuit(true);
        setTimeout(() => {
            setIsAnimateRetuit(false);
        }, 200);
    }
    const handleLikeBtn = () => {
        if (isLiked) {
            post.likes -= 1;
        } else {
            post.likes += 1;
        }

        like();
        setIsLiked(prev => !prev);
        setIsAnimateLike(true);
        setTimeout(() => {
            setIsAnimateLike(false);
        }, 200);
    }
    const handleBookmarkBtn = () => {
        bookmark();
        setIsBookmark(prev => !prev);
        setIsAnimateBookmark(true);
        setTimeout(() => {
            setIsAnimateBookmark(false);
        }, 200);
    }

    const handleShareBtn = () => {
        setIsAnimateShare(true);
        setTimeout(() => {
            setIsAnimateShare(false);
        }, 200);
    }

    function redirect() {
        if(selected) return;
        // window.location.href = `/post/${post.id}`;
        const route = `/post/${post.id}`;
        router.get(route);
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

    const userData = post.user_profile;

    return(
        <article
            onClick={redirect} 
            className={`relative flex
                ${post?.type === 'repost' 
                    ? 'pt-6.5'
                    : ''}
                ${selected 
                    ? 'px-1 flex-col'
                    : 'cursor-pointer hover:bg-[#81818124] px-4'} 
                py-2 transition-all duration-300 ease-in-out text-[15px] md:text-[16px]`
            }>
            {post.type &&
            <div className="absolute top-0 left-4.5">
                {post.type === 'repost' &&
                    <div className="flex gap-x-4 items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke={'#a2a2a2ff'}
                            strokeWidth={'2'} 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className={`w-[14px] h-[14px] md:h-[18px] md:w-[18px] lucide lucide-repeat-icon lucide-repeat}`}>
                            <path d="m17 2 4 4-4 4"/>
                            <path d="M3 11v-1a4 4 0 0 1 4-4h14"/>
                            <path d="m7 22-4-4 4-4"/>
                            <path d="M21 13v1a4 4 0 0 1-4 4H3"/>
                        </svg>
                        <span className="text-[#a2a2a2ff]">reposted</span>
                    </div>
                }
            </div>
            }
            <div className={`relative h-[50px] pr-2 ${selected ? 'w-fit mb-2' : ''}`} onMouseEnter={() => {setProfileHover(true)}} onMouseLeave={() => setProfileHover(false)}>
                <div className="relative bg-[#09122c] w-[50px] h-[50px] rounded-[50%] overflow-hidden group">
                    <picture className="w-full h-full">
                        <img src={userData.avatar ? userData.avatar : defaultAvatar} alt="" className="w-full h-full" draggable={false}/>
                    </picture>
                    <div className="absolute top-0 w-full h-full bg-transparent group-hover:bg-[#16161633] transition-all duration-300 ease-in-out"></div>
                </div>

                <div
                    onClick={(e) => {e.stopPropagation()}} 
                    className={`absolute top-0 transition-all duration-300 ease-in-out ${profileHover ? 'opacity-100 z-89' : 'opacity-0 z-89'}`}>
                    {showToolTip && 
                        <ProfileToolTip profId={userData.id.toLocaleString()}/>
                    }
                </div>
            </div>
            {selected && 
            <div className="absolute flex flex-col top-3 left-16">
                <a href={`/profile/${userData.id}`}>
                    <strong>{userData.name}</strong>
                </a>
                <a href={`/profile/${userData.id}`}>
                    <span className="text-[#a2a2a2ff]">{userData.username}</span>
                </a>
            </div>
            }
            <div className="flex flex-col gap-y-2 w-[90%]">
                {!selected && 
                <div className="flex gap-x-4">
                    <a href={`/profile/${userData.id}`}>
                        <strong>{userData.name}</strong>
                    </a>
                    <a href={`/profile/${userData.id}`}>
                        <span className="text-[#a2a2a2ff]">{userData.username}</span>
                    </a>
                    <span className="text-[#a2a2a2ff]">{parseDate(post.created_at, true)}</span>
                </div>
                }

                {post.post_text && 
                <div>
                    <p>{post.post_text}</p>
                </div>
                }

                {post.media && 
                <div onClick={(e) => {e.stopPropagation()}} className={`overflow-hidden items-strech rounded-[20px] justify-between gap-1 flex`}>
                    < DisplayMedia 
                        mediaArr={post.media}
                        handleClick={handleMediaClick}
                        type="View"
                        replying={false}
                    />
                </div>
                }

                <div className="flex justify-between text-[#a2a2a2ff]">
                    <button 
                        onClick={(e) => {
                            setIsMCommentOpen(true); 
                            document.body.style.overflow = 'hidden'; 
                            e.stopPropagation();
                            handleReplyBtn();
                        }} 
                        className="flex cursor-pointer transition-all duration-300 ease-in-out transfrom group items-center">
                        <div className="group-hover:bg-[#8a8a8a7d] transition-all duration-500 ease-in-out rounded-[50%] p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="#a2a2a2ff" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className={`w-[18px] h-[18px] md:h-[24px] md:w-[24px] lucide lucide-message-circle-icon lucide-message-circle transition-transform duration-200 ease-in-out transform ${isAnimateReply ? 'scale-125' : 'scale-100'}`}>
                                <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>
                            </svg>
                        </div>
                        {!selected &&
                            <NumberFlow className={`text-[#a2a2a2ff]`} value={post.replies} />
                        }
                    </button>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleRetuitBtn();
                        }}
                        className="flex cursor-pointer transition-all duration-300 ease-in-out transfrom group items-center">
                        <div className="group-hover:bg-[#8a8a8a7d] transition-all duration-500 ease-in-out rounded-[50%] p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke={`${isRetuit ? '#E17564' : '#a2a2a2ff'}`}
                                strokeWidth={'2'} 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className={`w-[18px] h-[18px] md:h-[24px] md:w-[24px] lucide lucide-repeat-icon lucide-repeat transition-transform duration-200 ease-in-out transform ${isAnimateRetuit ? 'scale-125' : 'scale-100'}`}>
                                <path d="m17 2 4 4-4 4"/>
                                <path d="M3 11v-1a4 4 0 0 1 4-4h14"/>
                                <path d="m7 22-4-4 4-4"/>
                                <path d="M21 13v1a4 4 0 0 1-4 4H3"/>
                            </svg>
                        </div>
                        {!selected &&
                            <NumberFlow className={`${isRetuit ? 'text-[#E17564]' : 'text-[#a2a2a2ff]'}`} value={updateRepost()} />
                        }
                    </button>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation(); 
                            handleLikeBtn()
                        }}
                        className="flex cursor-pointer transition-all duration-300 ease-in-out transfrom group items-center">
                        <div className="group-hover:bg-[#8a8a8a7d] transition-all duration-500 ease-in-out rounded-[50%] p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill={`${isLiked ? '#E17564' : 'none'}`}
                                stroke={`${isLiked ? '#E17564' : '#a2a2a2ff'}`} 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className={`w-[18px] h-[18px] md:h-[24px] md:w-[24px] lucide lucide-heart-icon lucide-heart transition-transform duration-200 ease-in-out transform ${isAnimateLike ? 'scale-125' : 'scale-100'}`}>
                                <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>
                            </svg>
                        </div>
                        {!selected &&
                            <NumberFlow className={`${isLiked ? 'text-[#E17564]' : 'text-[#a2a2a2ff]'}`} value={updateLikes()} />
                        }
                    </button>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleBookmarkBtn();
                        }}
                        className="flex cursor-pointer transition-all duration-300 ease-in-out transfrom group items-center">
                        <div className="group-hover:bg-[#8a8a8a7d] transition-all duration-500 ease-in-out rounded-[50%] p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 24 24" 
                                fill={`${isBookmark ? '#E17564' : 'none'}`}
                                stroke={`${isBookmark ? '#E17564' : '#a2a2a2ff'}`} 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className={`w-[18px] h-[18px] md:h-[24px] md:w-[24px] lucide lucide-bookmark-icon lucide-bookmark transition-transform duration-200 ease-in-out transform ${isAnimateBookmark ? 'scale-125' : 'scale-100'}`}>
                                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                            </svg>
                        </div>
                    </button>
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            handleShareBtn();
                        }}
                        className="flex cursor-pointer transition-all duration-300 ease-in-out transfrom group items-center">
                        <div className="group-hover:bg-[#8a8a8a7d] transition-all duration-500 ease-in-out rounded-[50%] p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" 
                                stroke="#a2a2a2ff" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className={`w-[18px] h-[18px] md:h-[24px] md:w-[24px] lucide lucide-share2-icon lucide-share-2 transition-transform duration-200 ease-in-out transform ${isAnimateShare ? 'scale-125' : 'scale-100'}`}>
                                <circle cx="18" cy="5" r="3"/>
                                <circle cx="6" cy="12" r="3"/>
                                <circle cx="18" cy="19" r="3"/>
                                <line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/>
                                <line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>
                            </svg>
                        </div>
                    </button>
                </div>

                {selected && 
                <>
                <div className="text-[#a2a2a2ff]">
                    <span>{parseDate(post.created_at, false)}</span>
                </div>

                <div className="flex justify-between items-center text-[#a2a2a2ff]">
                    <div className="flex gap-x-2">
                        <NumberFlow className={'text-white'} value={post.replies} />
                        <span>Replies</span>
                    </div>
                    <div className="flex gap-x-2">
                        <NumberFlow className={'text-white'} value={post.reposts} />
                        <span>Reposts</span>
                    </div>
                    <div className="flex gap-x-2">
                        <NumberFlow className={'text-white'} value={post.likes} />
                        <span>Likes</span>
                    </div>
                </div>
                </>
                }
            </div>
            
            <div className={`transition-all duration-500 ease-in-out ${isModalOpen ? 'opacity-100 z-10001' : 'opacity-0'}`}>
                {post.media && isModalOpen &&  <MediaModal mediaData={post.media} current={curMediaFocus} setOpenModal={setIsModalOpen}/>}
            </div>

            <div className={`transition-all duration-500 ease-in-out ${isMCommentOpen ? 'opacity-100 z-1000' : 'opacity-0'}`}>
                {isMCommentOpen && 
                    <CommentModal 
                        replying={true} 
                        setIsMcommentOpen={setIsMCommentOpen} 
                        target={
                            {postId:post.id.toString() ,username:userData.username }
                        }
                    />
                }
            </div>

        </article>
    )
}