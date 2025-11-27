import { MediaType } from "./MediaType";
import { ReducedUserType } from "./ReducedUserType";

export type PostType = {
    id:number;
    created_at: string;
    post_text: string | null;
    replies: number;
    reposts: number;
    likes: number;
    liked_by_cur_profile: boolean;
    reposted_by_cur_profile: boolean;
    bookmarked_by_cur_profile: boolean;
    originalPost?: PostType;
    media: Array<MediaType> | null,
    user_profile: ReducedUserType
    type?:string;
}