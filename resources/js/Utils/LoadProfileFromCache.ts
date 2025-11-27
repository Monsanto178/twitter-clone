import { FullUserType } from "../Types";

export const loadProfileFromCache = (profId:string) : FullUserType | null => {
    const cachedProfile = sessionStorage.getItem(`profile_${profId}`);
    return cachedProfile ? JSON.parse(cachedProfile) : null;
}