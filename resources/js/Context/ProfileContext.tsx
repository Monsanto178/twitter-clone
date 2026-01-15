import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FullUserType } from '@/Types';
import { loadProfileFromCache, saveProfileToCache, follow, fetchData} from '@/Utils';
import { usePage } from '@inertiajs/react';


interface ProfileContextType {
  loadProfile: (profileId: string) => Promise<void>;
  getProfile: (profileId: string, signal?: AbortSignal) => Promise<FullUserType | null>
  fullProfile: FullUserType | null;
  updateProfile: (profile: FullUserType) => void;
  followProfile: (profile: FullUserType) => Promise<void>;
  profileError: string | null;
  followError: string | null;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

interface ProviderProps {
    children: ReactNode
}


export const ProfileProvider = ({ children } : ProviderProps) => {
  const [fullProfile, setProfile] = useState<FullUserType | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [followError, setFollowError] = useState<string | null>(null);
  const curProfileId = (usePage().props.auth_user as {id: string}).id;


  // const loadProfile = async (profileId: string): Promise<void> => {
  //   const cachedProfile = loadProfileFromCache(profileId);
    
  //   setProfileError(null);
  //   setFollowError(null);

  //   try {
  //       if (cachedProfile) {
  //           setProfile(cachedProfile);
  //       } else {
  //           if(!profileId) return;
  //           const formData = new FormData();
  //           formData.append('id', profileId);
    
  //           const data = await fetchData<FullUserType>('/profile/getProfile', 'POST', formData);
  //           setProfile(data);
  //       }
  //   } catch (e) {
  //       console.error('Error trying to fetch profile:', e);
  //       setProfileError('Failed to load profile. Please try again later.');
  //   }
  // };

  const loadProfile = async (profileId: string): Promise<void> => {
    setProfileError(null);
    const profile = await getProfile(profileId);
    if (profile) {
      setProfile(profile);
    } else {
      setProfileError('Failed to load profile');
    }
  };

  const getProfile = async(profileId: string, signal?: AbortSignal): Promise<FullUserType | null> => {
    const cached = loadProfileFromCache(profileId);
    if(cached) return cached;

    const formData = new FormData();
    formData.append('id', profileId)
    try {
      const data = await fetchData<FullUserType>('/api/profile/getProfile', 'POST', formData, signal);
      saveProfileToCache(data);
      return data;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  const updateProfile = (newProfile: FullUserType) => {
    saveProfileToCache(newProfile);
    setProfile(newProfile);
  };

  const followProfile = async (profile: FullUserType) => {
    try {
      const updatedProfile = await follow(profile, curProfileId.toString());
      if (updatedProfile) {
        updateProfile(updatedProfile);
        loadProfile(profile.profile.id.toString())
      }
    } catch (e) {
      console.error('Error trying to follow profile:', e);
      setFollowError('Failed to follow profile. Try again later');
    }
  };

  return (
    <ProfileContext.Provider value={{ 
        fullProfile, profileError, followError,
        updateProfile, followProfile, loadProfile, getProfile}}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used inside a provider');
  }
  return context;
};