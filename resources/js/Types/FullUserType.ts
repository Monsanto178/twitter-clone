import { UserType } from "./UserType"

export type FullUserType = {
    profile: UserType,
    isFollowing: boolean,
    isFollowed: boolean,
    own_profile: boolean
}