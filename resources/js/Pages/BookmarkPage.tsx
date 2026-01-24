import React, { useEffect, useState } from "react";
import { BackBar, Post, ShowMoreBtn, Spinner } from "@/Components";
import { PostType } from "@/Types";
import { fetchData } from "@/Utils";
import { useErrorContext } from "@/Context/ErrorContext";

type PaginatedStats = {
    current_page: number,
    total: number,
    last_page: number
}
type PaginatedPosts = {
    posts: Array<PostType>,
    stats: PaginatedStats
}

interface Props {
    profileId: string;
}

export default function BookmarkPage({profileId}:Props) {
    const [posts, setPosts] = useState<PostType[] | null>(null);
    const [paginated, setPaginated] = useState<PaginatedStats | null>(null);
    const [postsLoading, setPostLoading] = useState<boolean>(true);
    const [loadMorePosts, setLoadMorePosts] = useState(false);

    const {setErrorState} = useErrorContext();

    const createFormData = (profileId:string, page:number | null = null) => {
        const formData = new FormData();
        formData.append('id', profileId);
        if(page) {
            formData.append('page', page.toString());
        }

        return formData;
    }

    async function fetchBookmark() {
        const page = paginated ? paginated.current_page + 1 : null
        const formData = createFormData(profileId, page);

        try {
            if(posts) setLoadMorePosts(true);
            const data = await fetchData<PaginatedPosts>('/api/bookmarks/getBookmarks', 'POST', formData);
            
            if(posts) {
                const sumArray = posts.concat(data.posts);
                const bookmarks:PaginatedPosts = {
                    posts: sumArray,
                    stats: data.stats
                }
                setPosts(bookmarks.posts);
                setPaginated(bookmarks.stats)
                return;
            }

            setPosts(data.posts);
            setPaginated(data.stats);
            setPostLoading(false);
        } catch (e) {
            console.error(e);
            setErrorState('Cannot load bookmarks. Please try again later');
        } finally {
            setPostLoading(false);
            setLoadMorePosts(false);
        }
    }

    useEffect(() => {
        if(posts) return;
        
        fetchBookmark();
    }, [])
    //Problem with showing errors:
    // if we have 2 tabs open the error from the 2do tab will also be displayed in the firts one and viceversa
    
    return (
        <>
        <section className="flex flex-col px-4 gap-y-4">
            <BackBar text="Bookmarks"/>

            {posts && !postsLoading && 
                posts.map((post, idx) => {
                    return (
                    <React.Fragment key={idx}>
                        <Post post={post} selected={false} />
                    </React.Fragment>
                    )
                })
            }
            {postsLoading && !posts && 
             <Spinner width="48" height="48"/>
            }
            {posts && !postsLoading && paginated?.current_page && paginated?.current_page !== paginated?.last_page && 
                <ShowMoreBtn fetchAction={fetchBookmark} page={(paginated.current_page+1).toString()} loadFlag={loadMorePosts}/>
            }
            {!postsLoading && posts && posts.length < 1 && 
                <div className="flex flex-col justify-center items-center gap-y-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 26 26">
                        <g fill="#fff">
                            <path fillRule="evenodd" d="M7.5 6a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v14a.5.5 0 0 1-.855.352L13 15.676l-4.645 4.676A.5.5 0 0 1 7.5 20zm1 .5v12.287l4.145-4.172a.5.5 0 0 1 .71 0l4.145 4.172V6.5z" clipRule="evenodd" />
                            <path d="M4.15 4.878a.514.514 0 0 1 .728-.727l16.971 16.971a.514.514 0 0 1-.727.727z" />
                            <path fillRule="evenodd" d="M13 24.5c6.351 0 11.5-5.149 11.5-11.5S19.351 1.5 13 1.5S1.5 6.649 1.5 13S6.649 24.5 13 24.5m0 1c6.904 0 12.5-5.596 12.5-12.5S19.904.5 13 .5S.5 6.096.5 13S6.096 25.5 13 25.5" clipRule="evenodd" />
                        </g>
                    </svg>
                    <h4>No bookmarks has been founded.</h4>
                </div>
            }
        </section>
        </>
    )
}