import { fetchData } from "./FetchData";
import { saveProfileToCache } from "./SaveProfileToCache";
import { FullUserType } from "../Types";

export const follow = async(fullProfile:FullUserType): Promise<FullUserType | null> => {
    const formData = new FormData();

    if(!fullProfile) return null;

    formData.append('id', fullProfile.profile.id.toString());

    const data = await fetchData<boolean>('/profile/follow', 'POST', formData);

    if(data) {
        fullProfile.profile.followers += 1;
    } else {
        fullProfile.profile.followers -= 1;
    }
    fullProfile.isFollowing = data;

    saveProfileToCache(fullProfile);

    return fullProfile
}