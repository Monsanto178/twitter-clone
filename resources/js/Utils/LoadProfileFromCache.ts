import { FullUserType } from "@/Types";

export const loadProfileFromCache = (profId:string) : FullUserType | null => {
    const cachedProfile = localStorage.getItem(`profile_${profId}`);
    if(cachedProfile) {
        const parsed = JSON.parse(cachedProfile);
        const now = new Date().getTime();
        if(now > parsed.expiry) {
            localStorage.removeItem(`profile_${profId}`);

            return null;
        }

        return parsed.profile;
    }
    
    // return cachedProfile ? JSON.parse(cachedProfile) : null;
    return null;
}