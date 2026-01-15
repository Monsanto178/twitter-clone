import { Post, CommentBox, Spinner, ShowMoreBtn, Thread} from "@/Components";
import { useEffect, useState } from "react";
import { PostType } from "@/Types";
import { fetchData } from "@/Utils";
import defaultAvatar from "@assets/user_avatar_default.png";

type Response = {
    status: 'success' | 'error';
    code: number;
    message: string;
    error?: string;
    data?: {avatar: string};
}

type PaginatedPosts = {
    current_page: number,
    data: PostType[]
    total: number,
    last_page: number
}
type Stats = {
    current_page: number,
    total: number,
    last_page: number
}
// type PaginatedPosts = {
//     posts: Array<PostType>,
//     stats: PaginatedStats
// }

export default function Home() {
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [posts, setPosts] = useState<PostType[] | null>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadMore, setLoadMore] = useState<boolean>(false);
    const [errorState, setErrorState] = useState<string | null>(null);

    async function getProfPic() {
        try {
            const response = await fetchData<Response>('/getProfilePic', 'GET');
            
            if(response.data) setProfilePic(response.data.avatar);
        } catch (e) {
            console.error(e);
        }
    }

    async function fetchPosts(page:string | null = null) {
        const formData = new FormData();
        if(page) formData.append('page', page);

        try {
            if(posts) setLoadMore(true);
            const postsData = await fetchData<PaginatedPosts>('/api/post/all', "POST", formData);
            
            if(posts) {
                const sumArray = posts.concat(postsData.data);
                setPosts(sumArray);
                const stats : Stats = {
                    current_page: postsData.current_page,
                    last_page: postsData.last_page,
                    total: postsData.total,
                }
                setStats(stats);

                return;
            }

            const stats : Stats = {
                current_page: postsData.current_page,
                last_page: postsData.last_page,
                total: postsData.total,
            }
            setStats(stats);
            setPosts(postsData.data);

        } catch (e) {
            console.error(e);
            setErrorState('Oops... Cannot load posts right now. Please try again later');
        } finally {
            setLoading(false);
            setLoadMore(false);
        }
    }

    // async function fetchParentPost(parentId: number):Promise<PostType | null> {
    //     const formData = new FormData();
    //     formData.append('id', parentId.toString());

    //     try {
    //         const response = await fetchData<PostType>('/api/getParent', 'POST', formData);
            
    //         return response;
    //     } catch (e) {
    //         console.error(e);
    //         return null;
    //     }
    // }

    useEffect(() => {
        if(profilePic) return;

        getProfPic();
    }, [])

    useEffect(() => {
        if(posts) return;

        fetchPosts();
    }, [])
    return (
        <>
            <CommentBox cover_img={profilePic ? profilePic : defaultAvatar}/>
            <section className="flex flex-col">
                {loading && 
                    <Spinner width="48" height="48"/>
                }

                {!loading && errorState && 
                    <div className="flex justify-center items-center">
                        <span>{errorState}</span>
                    </div>
                }

                {!loading && posts && 
                    posts.map((post, idx) => {
                        if (post.parent_post_id) {
                            if(post.originalPost) return <Thread key={idx} post={post.originalPost} reply={post}/>
                            
                            return <Post key={idx} post={post} selected={false}/>
                        }

                        if(!post.parent_post_id) return <Post key={idx} post={post} selected={false}/>
                    })
                    
                }
                {posts && !loading && stats?.current_page && stats?.current_page !== stats?.last_page && 
                    <ShowMoreBtn fetchAction={fetchPosts} page={(stats.current_page+1).toString()} loadFlag={loadMore}/>
                }
            </section>
        </>
        )
}