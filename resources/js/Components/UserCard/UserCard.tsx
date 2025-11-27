import { ReducedUserType } from '../../Types';
import defaultAvatar from "../../../assets/user_avatar_default.png";
import { fetchData } from '../../Utils';
import { router } from '@inertiajs/react';

interface Props {
    profile: ReducedUserType;
}
type Response = {
    status: string,
    redirect: string
}
export const UserCard = ({profile}:Props) => {
    const login = async() => {
        try {
            const formData = new FormData();
            formData.append('id', profile.user_id);
            const data = await fetchData<Response>('/login', 'POST', formData);

           router.visit(data.redirect)
            
            
            
        } catch(e) {
            // setError('Failed to load profiles. Please reload the page')
            console.error(e)
        }
    }
    return(
        <div onClick={login}
            className='flex flex-col gap-y-2 bg-[#00224D] p-4 rounded-[20%]
            cursor-pointer transition-scale duration-300 ease-in-out
            hover:scale-105'>
            <picture className={"w-[160px] h-[160px] rounded-[50%] overflow-hidden group"}>
                <img src={profile.avatar ? profile.avatar : defaultAvatar} alt="cover_img" className="w-full h-full" draggable={false}/>
            </picture>

            <div className='flex justify-center items-center text-[16px]'>
                <strong>{profile.username}</strong>
            </div>
        </div>
    )
}
