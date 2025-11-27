import React, { useEffect, useState } from "react";
import { BackBar, Post, Spinner } from "../Components";
import { PostType } from "../Types";
import { fetchData } from "../Utils";
import { useErrorContext } from "../Context/ErrorContext";

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
    const [paginatedPosts, setPaginatedPosts] = useState<PaginatedPosts | null>(null);
    const [postsLoading, setPostLoading] = useState<boolean>(true);
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
        const page = paginatedPosts ? paginatedPosts.stats.current_page + 1 : null
        const formData = createFormData(profileId, page);

        try {
            if(paginatedPosts) setPostLoading(true);
            const data = await fetchData<PaginatedPosts>('/bookmarks/getBookmarks', 'POST', formData);
            console.log(data);
            
            if(paginatedPosts) {
                const sumArray = paginatedPosts.posts.concat(data.posts);
                const bookmarks:PaginatedPosts = {
                    posts: sumArray,
                    stats: data.stats
                }
                setPaginatedPosts(bookmarks);
                return;
            }

            setPaginatedPosts(data);
        } catch (e) {
            console.error(e);
            setErrorState('Cannot load bookmarks. Please try again later');
        } finally {
            setPostLoading(false);
        }
    }

    useEffect(() => {
        if(paginatedPosts) return;
        
        fetchBookmark();
    }, [])
    //Problem with showing errors:
    // if we have 2 tabs open the error from the 2do tab will also be displayed in the firts one and viceversa
    
    return (
        <>
        <section className="flex flex-col px-4 gap-y-4">
            <BackBar text="Bookmarks"/>

            {paginatedPosts?.posts && !postsLoading && 
                paginatedPosts.posts.map((post, idx) => {
                    return (
                    <React.Fragment key={idx}>
                        <Post post={post} selected={false} />
                    </React.Fragment>
                    )
                })
            }
            {postsLoading && !paginatedPosts && 
             <Spinner width="48" height="48"/>
            }
        </section>
        </>
    )
}