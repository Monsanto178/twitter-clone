import { Post, PostSkeleton, BackBar} from "../Components";
import { useEffect, useState } from "react";
import { getCsrfToken } from "../Utils";
import { PostType } from "Types";
import { useReplyContext } from "../Context/ReplyContext";

type Props = {
    postId: string;
}

export default function PostPage({postId}: Props) {
    const [post, setPost] = useState<PostType | null>(null);
    const [loadingPost, setLoadingPost] = useState(true);

    const [replies, setReplies] = useState<Array<PostType> | null>(null);
    const [loadingReplies, setLoadingReplies] = useState(true);

    const {reloadReply, setReloadReply} = useReplyContext();

    const fetchPost = async () => {
        try {
            const csrfToken = await getCsrfToken();
            const formData = new FormData();
            formData.append('postId', postId);

            const response = await fetch('/getpost', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: formData
            })
            if(!response.ok) throw new Error("SOMETHING WENT WRONG.");
            const data = await response.json();

            setPost(data)
            console.log(data);
            

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingPost(false)
        }
    }

    const fetchReplies = async () => {
        try {
            const csrfToken = await getCsrfToken();
            const formData = new FormData();
            formData.append('postId', postId);

            const response = await fetch('/replies', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: formData
            })
            if(!response.ok) throw new Error("SOMETHING WENT WRONG.");
            const data = await response.json();

            setReplies(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoadingReplies(false);
        }
    }
    
    useEffect(() => {
        fetchPost();
    }, [])

    useEffect(() => {
        if(!reloadReply) return;

        // fetchReplies();
        window.location.reload();
        setReloadReply(false);
    }, [reloadReply])

    useEffect(() => {
        if(!post) return
        fetchReplies();
    }, [post])

    return (
        <>
        {!loadingPost && post &&
            <section className="flex flex-col px-4 gap-y-4">
                <BackBar text="Post"/>
                <Post post={post} selected={true}/>
                {replies &&
                <>
                <div className="mb-2">
                    <span>{replies.length>0 ? 'Replies to this post:' : 'This post has no replies.'}</span>
                </div>
                <div className="flex flex-col">
                    {replies.length>0 && 
                        replies.map((reply, idx) => {
                            return (
                                <Post key={idx} post={reply} selected={false}/>
                            )
                        })
                    }
                </div>
                </>
                }

                {loadingReplies && 
                <div className="flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        width="48" 
                        height="48" 
                        viewBox="0 0 24 24">
                        <path 
                            fill="none" 
                            stroke="#fff" 
                            strokeLinecap="round" 
                            strokeWidth="1.5" 
                            d="M12 6.99998C9.1747 6.99987 6.99997 9.24998 7 12C7.00003 14.55 9.02119 17 12 17C14.7712 17 17 14.75 17 12">
                            <animateTransform 
                                attributeName="transform" 
                                attributeType="XML" 
                                dur="860ms" 
                                from="0,12,12" 
                                repeatCount="indefinite" 
                                to="360,12,12" 
                                type="rotate"/>
                        </path>
                    </svg>
                </div>
                }
            </section>
        }
        {loadingPost &&
            <PostSkeleton/>
        }
        </>
    )
}