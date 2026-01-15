import { FullUserType } from "@/Types";

const TIME_EXPIRATION = 60 * 60 * 1000;
export const saveProfileToCache = (profileBox: FullUserType) => {
    const now = new Date().getTime();
    const toStore = {
        profile: profileBox,
        expiry: now + TIME_EXPIRATION
    }
    localStorage.setItem(`profile_${profileBox.profile.id}`, JSON.stringify(toStore));
};