import { Post, PostSkeleton, BackBar, Spinner, ReplyThread} from "@/Components";
import { useEffect, useState } from "react";
import { fetchData } from "@/Utils";
import { PostType } from "@/Types";
import { useReplyContext } from "@/Context/ReplyContext";

type Props = {
    postId: string;
}

export default function PostPage({postId}: Props) {
    const [post, setPost] = useState<PostType | null>(null);
    const [loadingPost, setLoadingPost] = useState(true);
    const [postErrors, setPostErrors] = useState<string | null>(null)

    const [replies, setReplies] = useState<Array<PostType> | null>(null);
    const [loadingReplies, setLoadingReplies] = useState(true);
    const [repliesErrors, setRepliesErrors] = useState<string | null>(null)

    const [parentPost, setParentPost] = useState<PostType | null>(null);
    const [loadingParent, setLoadingParent] = useState<boolean>(true);

    const {reloadReply, setReloadReply} = useReplyContext();

    const fetchPost = async () => {
        const formData = new FormData();
        formData.append('postId', postId);

        try {
            const response = await fetchData<PostType>('/api/getpost', 'POST', formData);

            setPost(response);

        } catch (error) {
            console.error(error);
            setPostErrors('Oops... Cannot load posts right now. Please try again later');
        } finally {
            setLoadingPost(false)
        }
    }

    const fetchParent = async (id:string) => {
        const formData = new FormData();
        formData.append('postId', id);

        try {
            const response = await fetchData<PostType>('/api/getpost', 'POST', formData);

            setParentPost(response);

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingParent(false)
        }
    }

    const fetchReplies = async () => {
        const formData = new FormData();
        formData.append('postId', postId);

        try {
            const response = await fetchData<PostType[]>('/api/replies', 'POST', formData);

            setReplies(response);

        } catch (error) {
            console.error(error);
            setRepliesErrors('Oops... Cannot load posts right now. Please try again later');
        } finally {
            setLoadingReplies(false)
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

    useEffect(() => {
        if(!post) return
        if(!post.parent_post_id) return;

        const postId = post.parent_post_id.toString();
        fetchParent(postId);
    }, [post])

    return (
        <>
        <section className="flex flex-col px-4 gap-y-4">
            <BackBar text="Post"/>
            {!loadingPost && post &&
                <>
                    {post.parent_post_id && loadingParent && 
                    <div className="flex justify-center items-center">
                        <Spinner height="48" width="48"/>
                    </div>
                    }
                    {post.parent_post_id && !loadingParent && parentPost &&
                        <ReplyThread post={parentPost} reply={post}/>
                    }
                    {!post.parent_post_id && 
                        <Post post={post} selected={true} />
                    }
                    {replies &&
                    <>
                    <div className="mb-2 flex justify-center items-center">
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
                        <Spinner height="48" width="48"/>
                    </div>
                    }

                    {!loadingReplies && repliesErrors && 
                        <div className="flex justify-center items-center mt-4">
                            <span>{repliesErrors}</span>
                        </div>
                    }
                </>
            }
            {loadingPost &&
                <PostSkeleton/>
            }
            {!loadingPost && postErrors &&
                <div className="flex flex-col justify-center items-center mt-4 gap-y-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 24 24">
                        <g fill="none" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                            <path d="m13.5 8.5l-5 5m0-5l5 5" />
                            <circle cx="11" cy="11" r="8" />
                            <path d="m21 21l-4.3-4.3" />
                        </g>
                    </svg>
                    <span>{postErrors}</span>
                </div>
            }
        </section>
        </>
    )
}