import { fetchData } from "./FetchData";
import { saveProfileToCache } from "./SaveProfileToCache";
import { FullUserType } from "@/Types";
import { loadProfileFromCache } from "./LoadProfileFromCache";

export const follow = async(fullProfile:FullUserType, curProfId:string): Promise<FullUserType | null> => {
    const formData = new FormData();

    if(!fullProfile) return null;

    formData.append('id', fullProfile.profile.id.toString());

    const data = await fetchData<boolean>('/api/profile/follow', 'POST', formData);
    const curProfile = loadProfileFromCache(curProfId);
    
    if(data) {
        if(curProfile) curProfile.profile.following += 1;
        fullProfile.profile.followers += 1;
    } else {
        if(curProfile) curProfile.profile.following -= 1;
        fullProfile.profile.followers -= 1;
    }
    fullProfile.isFollowed = data;
    console.log('current prof');
    console.log(curProfile);
    
    
    if(curProfile) saveProfileToCache(curProfile);
    saveProfileToCache(fullProfile);

    return fullProfile
}