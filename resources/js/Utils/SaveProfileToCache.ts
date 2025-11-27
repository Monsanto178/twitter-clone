import { FullUserType } from "../Types";

export const saveProfileToCache = (profileBox: FullUserType) => {
    sessionStorage.setItem(`profile_${profileBox.profile.id}`, JSON.stringify(profileBox));
};