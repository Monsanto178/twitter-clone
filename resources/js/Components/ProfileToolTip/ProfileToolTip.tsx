import defaultAvatar from "../../../assets/user_avatar_default.png";
import { useEffect, useState } from "react";
import { Spinner } from "../Loading/Spinner";
import NumberFlow from "@number-flow/react";
import { useUserProfile } from '../../Context/ProfileContext';
import { useErrorContext } from "../../Context/ErrorContext";
import { FullUserType } from '../../Types/FullUserType';


type Props = {
    profId: string;
}

export const ProfileToolTip = ({profId}:Props) => {
    const {fullProfile, followProfile, getProfile, followError} = useUserProfile();
    const [localProfile, setLocalProfile] = useState<FullUserType | null>(null);
    const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
    const [localProfileError, setLocalProfileError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {setErrorState} = useErrorContext();

    const followBtn = async () => {
        if(!fullProfile) return;
        setIsLoading(true);
        followProfile(fullProfile).finally(() => {
            setIsLoading(false);
            if(followError) {
                setErrorState(followError)
            } else {
                if(!localProfile) return;
                localProfile.isFollowing = !localProfile.isFollowing;
                const followers = localProfile.isFollowing ? localProfile.profile.followers + 1 : localProfile.profile.followers - 1;
                localProfile.profile.followers = followers;
            }
        });
    }

    useEffect(() => {
        setLoadingProfile(true);
        const controller = new AbortController();
        (async () => {
            const profile = await getProfile(profId, controller.signal);
            if (!controller.signal.aborted) {
                setLocalProfile(profile)
                setLocalProfileError('Failed to load profile. Try again later');
            };
        })();
        setLoadingProfile(false);

        return () => controller.abort();
    }, [profId])
    return (
        <article className="absolute w-80 top-12 p-3 bg-[#040B20] flex flex-col gap-2 rounded-[15px] z-89">
            {localProfile && !loadingProfile && 
            <>
            <div className="flex justify-between">
                <a 
                    href={`/profile/${localProfile.profile.id}`}
                    className="w-[80px] h-[80px] rounded-[50%] overflow-hidden group">
                    <picture>
                        <img src={localProfile.profile.avatar ? localProfile.profile.avatar : defaultAvatar} alt="cover_img" className="w-full h-full" draggable={false}/>
                    </picture>
                </a>

                {!localProfile.own_profile && 
                <button 
                    onClick={followBtn}
                    disabled={isLoading}
                    className="flex w-20 h-12 items-center justify-center p-1 bg-[#BE3144] transition-all duration-300 
                        hover:bg-[#872341] rounded-[20px] cursor-pointer
                        disabled:cursor-wait disabled:bg-[#d97a8d] disabled:opacity-50">
                    <strong>{localProfile.isFollowing ? 'Unfollow' : 'Follow'}</strong>
                </button>
                }
            </div>

            <div className="flex flex-col">
                <a 
                    href={`/profile/${localProfile.profile.id}`}
                    className="w-fit">
                    <strong>{localProfile.profile.name}</strong>
                </a>
                <a 
                    href={`/profile/${localProfile.profile.id}`}
                    className="w-fit">
                    <span>{localProfile.profile.username}</span>                
                </a>
            </div>

            <div>
                <p>{localProfile.profile.bio}</p>
            </div>

            <div className="flex justify-between">
                <div className="flex gap-1">
                    <strong>
                        <NumberFlow value={localProfile.profile.following}/>
                    </strong>
                    <span>Following</span>
                </div>

                <div className="flex gap-1">
                    <strong>
                        <NumberFlow value={localProfile.profile.followers}/>
                    </strong>
                    <span>Followers</span>
                </div>
            </div>
            </>
            }

            {loadingProfile && 
                <Spinner width="32" height="32" />
            }

            {!localProfile && !loadingProfile && localProfileError &&
                <div className="flex justify-center items-center">
                    <span>{localProfileError}</span>
                </div>
            }
        </article>
    )
}