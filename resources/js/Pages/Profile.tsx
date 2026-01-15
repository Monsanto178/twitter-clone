import { Post, ProfileCard, Thread, Spinner, ProfileBackBar, ShowMoreBtn} from "../Components";
import React, { useEffect, useState } from "react";
import { PostType } from "@/Types";
import { fetchData } from "@/Utils";
import { useUserProfile } from '@/Context/ProfileContext';
import { useErrorContext } from "@/Context/ErrorContext";

type Props = {
    profileId: string;
}
type PaginatedStats = {
    current_page: number,
    total: number,
    last_page: number
}
type PaginatedPosts = {
    posts: Array<PostType>,
    stats: PaginatedStats
}

type Options = 'Posts' | 'Replies' | 'Media' | 'Likes';

export default function Profile({profileId}:Props) {
    const [currentOpt, setCurrentOpt] = useState<Options>('Posts');
    const {fullProfile, loadProfile, followProfile, profileError, followError} = useUserProfile();

    const [posts, setPosts] = useState<Array<PostType> | null>(null);
    const [replies, setReplies] = useState<Array<PostType> | null>(null);
    const [media, setMedia] = useState<Array<PostType> | null>(null);
    const [likes, setLikes] = useState<Array<PostType> | null>(null);

    const [paginated, setPaginated] = useState<PaginatedStats | null>(null);
    const [pagReplies, setPagReplies] = useState<PaginatedStats | null>(null);
    const [pagMedia, setPagMedia] = useState<PaginatedStats | null>(null);
    const [pagLikes, setPagLikes] = useState<PaginatedStats | null>(null);

    const [userLoading, setUserLoading] = useState(true);
    const [postsLoading, setPostsLoading] = useState(true);
    const [repliesLoading, setRepliesLoading] = useState(true);
    const [mediaLoading, setMediaLoading] = useState(true);
    const [likesLoading, setLikesLoading] = useState(true);
    const [isFollowLoading, setIsFollowingLoading] = useState(false);

    const [loadMorePosts, setLoadMorePosts] = useState(false);
    const [loadMoreReplies, setLoadMoreReplies] = useState(false);
    const [loadMoreMedia, setLoadMoreMedia] = useState(false);
    const [loadMoreLikes, setLoadMoreLikes] = useState(false);
    

    const {setErrorState} = useErrorContext();

    const createFormData = (profileId:string, page:string | null = null) => {
        const formData = new FormData();
        formData.append('id', profileId);
        if(page) {
            formData.append('page', page);
        }

        return formData;
    }

    async function fetchPosts(page:string | null = null) {
        const formData = createFormData(profileId, page);

        try {
            if(posts) setLoadMorePosts(true);
            const postsData = await fetchData<PaginatedPosts>('/api/profile/getPosts', "POST", formData);
            
            if(posts) {
                const sumArray = posts.concat(postsData.posts);
                setPosts(sumArray);
                setPaginated(postsData.stats);

                return;
            }

            setPosts(postsData.posts);
            setPaginated(postsData.stats);
            setPostsLoading(false);
        } catch (e) {
            console.error(e);
            setErrorState('Oops... Cannot load posts right now. Please try again later');
        } finally {
            setLoadMorePosts(false);
        }
    }
    async function fetchReplies(page:string | null = null) {
        const formData = createFormData(profileId, page);

        if(page) {
            formData.append('page', page);
        }
        try {
            if(replies) setLoadMoreReplies(true);
            const repliesData = await fetchData<PaginatedPosts>('/api/profile/getReplies', "POST", formData);

            if(replies) {
                const sumArray = replies.concat(repliesData.posts);
                setReplies(sumArray);
                setPagReplies(repliesData.stats);

                return;
            }

            setReplies(repliesData.posts);
            setPagReplies(repliesData.stats);
            setRepliesLoading(false);
        } catch (e) {
            console.error(e);
            setErrorState('Oops... Cannot load posts right now. Please try again later');
        } finally {
            setLoadMoreReplies(false);
        }
    }
    async function fetchMedia(page:string | null = null) {
        const formData = createFormData(profileId, page);

        try {
            if(media) setLoadMoreMedia(true);
            const mediaData = await fetchData<PaginatedPosts>('/api/profile/getMedia', "POST", formData);

            if(media) {
                const sumArray = media.concat(mediaData.posts);
                setMedia(sumArray);
                setPagMedia(mediaData.stats);

                return;
            }
            
            setMedia(mediaData.posts);
            setPagMedia(mediaData.stats)
            setMediaLoading(false);
        } catch (e) {
            console.error(e);
            setErrorState('Oops... Cannot load posts right now. Please try again later');
        } finally {
            setLoadMoreMedia(false);
        }
    }
    async function fetchLikes(page:string | null = null) {
        const formData = createFormData(profileId, page);

        try {
            if(likes) setLoadMoreLikes(true);
            const likesData = await fetchData<PaginatedPosts>('/api/profile/getLikes', "POST", formData);

            if(likes) {
                const sumArray = likes.concat(likesData.posts);
                setLikes(sumArray);
                setPagLikes(likesData.stats);

                return;
            }

            setLikes(likesData.posts);
            setPagLikes(likesData.stats)
            setLikesLoading(false);
        } catch (e) {
            console.error(e);
            setErrorState('Oops... Cannot load posts right now. Please try again later');
        } finally {
            setLoadMoreLikes(false);
        }
    }

    const displayMessage = (message:string) => {
        return (
            <article className="flex justify-center items-center">
                <div>
                    {message}
                </div>
            </article>
        )
    }

    const followBtn = async() => {
        if(!fullProfile) return;

        setIsFollowingLoading(true);
        followProfile(fullProfile)
        .finally(() => {
            setIsFollowingLoading(false);
            if(followError) setErrorState(followError);
        });
    }

    useEffect(() => {
        setUserLoading(true);
        loadProfile(profileId).finally(() => {
            setUserLoading(false);
            if(profileError) setErrorState(profileError);
        });
    }, [])

    useEffect(() => {
        if(!fullProfile || posts) return;
        fetchPosts();
    }, [fullProfile, posts]);

    useEffect(() => {
        switch (currentOpt) {
            case 'Posts':
                if(posts) return;

                fetchPosts();
                break;
            case 'Replies':
                if(replies) return;

                fetchReplies();
                break;
            case 'Media':
                if(media) return;

                fetchMedia();
                break;
            case 'Likes':
                if(likes) return;

                fetchLikes();
                break;
            default:
                break;
        }
    },[currentOpt])

    return (
        <div className="px-4 py-2 gap-4 flex flex-col">
            {fullProfile && !userLoading && 
            <>
            
            <ProfileBackBar fullProfile={fullProfile} isFollowLoading={isFollowLoading} paginated={paginated} followBtn={followBtn}/>
            <ProfileCard user={fullProfile.profile} own_prof={fullProfile.own_profile} id={profileId}/>


            <section className="mx-0 sm:mx-4 relative">
                <div className="flex justify-between text-[16px] sm:text-[18px]">
                    <button 
                        onClick={() => {
                            setCurrentOpt('Posts');
                        }} 
                        className={`${currentOpt === 'Posts' ? 'font-[400] scale-105' : 'hover:scale-110'} transition-scale duration-300 ease-in-out cursor-pointer w-[25%]  p-2`}>
                            Posts
                    </button>
                    <button 
                        onClick={() => {
                            setCurrentOpt('Replies');
                        }} 
                        className={`${currentOpt === 'Replies' ? 'font-[400] scale-105' : 'hover:scale-110'} transition-scale duration-300 ease-in-out cursor-pointer w-[25%]  p-2`}>
                            Replies
                    </button>
                    <button 
                        onClick={() => {
                            setCurrentOpt('Media');
                        }} 
                        className={`${currentOpt === 'Media' ? 'font-[400] scale-105' : 'hover:scale-110'} transition-scale duration-300 ease-in-out cursor-pointer w-[25%]  p-2`}>
                            Media
                    </button>
                    <button 
                        onClick={() => {
                            setCurrentOpt('Likes');
                        }} 
                        className={`${currentOpt === 'Likes' ? 'font-[400] scale-105' : 'hover:scale-110'} transition-scale duration-300 ease-in-out cursor-pointer w-[25%]  p-2`}>
                            Likes
                    </button>
                </div>
                <div
                className="absolute bottom-0 left-0 w-[25%] h-[4px] bg-blue-500 transition-all duration-300 ease-in-out"
                style={{
                    left: currentOpt === 'Posts' ? '0%' :
                            currentOpt === 'Replies' ? '25%' :
                            currentOpt === 'Media' ? '50%' : '75%',
                }}
                />
            </section>

            <section>
                {currentOpt === 'Posts' &&
                <>
                    {posts && !postsLoading && 
                        posts.map((post, idx) => {
                            return(
                                <React.Fragment key={idx}>
                                    <Post key={idx} post={post} selected={false}/>
                                </React.Fragment>
                            )
                        })

                    }
                    {posts && !postsLoading && paginated?.current_page && paginated?.current_page !== paginated?.last_page && 
                        <ShowMoreBtn fetchAction={fetchPosts} page={(paginated.current_page+1).toString()} loadFlag={loadMorePosts}/>
                    }
                    {!postsLoading && posts?.length === 0 &&
                        displayMessage(`No posts found on this profile`)
                    }
                    {!posts && postsLoading && 
                        <Spinner width={'48'} height={'48'} />
                    }
                </>
                }
                {currentOpt === 'Replies' && 
                <>
                    {replies && !repliesLoading && 
                        replies.map((post, idx) => {
                            return(
                                <div key={idx}>
                                    {post.originalPost && 
                                        <Thread post={post.originalPost} reply={post}/>
                                    }
                                </div>
                            )
                        })
                    }
                    {replies && !repliesLoading && pagReplies?.current_page && pagReplies?.current_page !== pagReplies?.last_page && 
                        <ShowMoreBtn fetchAction={fetchReplies} page={(pagReplies.current_page+1).toString()} loadFlag={loadMoreReplies}/>
                    }

                    {!repliesLoading && replies?.length === 0 &&
                        displayMessage(`No replies found on this profile`)
                    }
                    {!replies && repliesLoading && 
                    <Spinner width={'48'} height={'48'} />
                    }
                </>
                }
                {currentOpt === 'Media' && 
                <>
                    {media && !mediaLoading && 
                        media.map((post, idx) => {
                            return(
                                <Post key={idx} post={post} selected={false}/>
                            )
                        })
                    }
                    {media && !mediaLoading && pagMedia?.current_page && pagMedia?.current_page !== pagMedia?.last_page && 
                        <ShowMoreBtn fetchAction={fetchMedia} page={(pagMedia.current_page+1).toString()} loadFlag={loadMoreMedia}/>
                    }

                    {!mediaLoading && media?.length === 0 &&
                        displayMessage(`No media found on this profile`)
                    }
                    {!media && mediaLoading && 
                        <Spinner width={'48'} height={'48'} />
                    }
                </>
                }
                {currentOpt === 'Likes' && 
                <>
                    {likes && !likesLoading && 
                        likes.map((post, idx) => {
                            return(
                                <Post key={idx} post={post} selected={false}/>
                            )
                        })
                    }
                    {likes && !likesLoading && pagLikes?.current_page && pagLikes?.current_page !== pagLikes?.last_page && 
                        <ShowMoreBtn fetchAction={fetchLikes} page={(pagLikes.current_page+1).toString()} loadFlag={loadMoreLikes}/>
                    }
                    {!likesLoading && likes?.length === 0 &&
                        displayMessage(`No likes found on this profile`)
                    }
                    {!likes && likesLoading && 
                        <Spinner width={'48'} height={'48'} />
                    }
                </>
                }
            </section>
            </>
            }
        </div>
    )
}