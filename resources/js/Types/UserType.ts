export type UserType = {
    id: string | number;
    avatar: string;
    banner?: string | null;
    name: string;
    username: string;
    bio?: string;
    following: number;
    followers: number;
    creation_date?: string;
}