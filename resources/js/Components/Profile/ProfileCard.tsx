type User = {
    cover_img: string;
    user_name: string;
    user_alias: string;
    biography?: string;
    following: number;
    followers: number;
    creation_date?: string;
    post_number: number;
    profile_banner:string | null;
}

type Props = {
    user: User;
}

export const ProfileCard = ({user}: Props) => {
    return (
        <>
        <section className="relative">
            <article className={`absolute top-0 bg-cover bg-center p-40 w-full cursor-pointer`} style={user.profile_banner ? {backgroundImage:`url('${user.profile_banner}')`} : {}}>
                <div className="absolute inset-0 backdrop-blur-[2px] bg-black/30"></div>
            </article>

            <article className="relative pt-70 sm:pt-60 px-4 z-10 flex flex-col gap-2 transition-all duration-300 ease-in-out">
                <div className="relative flex justify-between">
                    <div className="flex flex-col gap-2">
                        <picture className="w-[100px] sm:w-[150px] w-[100px] sm:h-[150px] rounded-[50%] transition-all duration-300 ease-in-out overflow-hidden group">
                            <img src={user.cover_img} alt="cover_img" className="w-full h-full" draggable={false}/>
                        </picture>
                        
                        <div className="flex flex-col">
                            <strong className="text-[20px]">{user.user_name}</strong>
                            <span className="text-[#ffffff7d]">{user.user_alias}</span>
                        </div>
                    </div>

                    <div className="flex absolute right-0 top-12 sm:top-22 transition-all duration-300 ease-in-out">
                        <button className="w-12 h-12 md:w-50 md:h-12 flex items-center justify-center bg-[#BE3144] transition-all duration-300 ease-in-out hover:bg-[#872341] cursor-pointer rounded-[25px] overflow-hidden">
                            <span className="hidden md:block">Edit Profile</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:hidden block lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                        </button>
                    </div>
                </div>

                <div className={`${user.biography ? 'block' : 'hidden'}`}>
                    <p>{user.biography}</p>
                </div>
                <div className="flex gap-8">
                    <div className="flex gap-2">
                        <strong>{user.following}</strong>
                        <span className="text-[#ffffff7d]">Following</span>
                    </div>
                    <div className="flex gap-2">
                        <strong>{user.followers}</strong>
                        <span className="text-[#ffffff7d]">Followers</span>
                    </div>
                </div>
            </article>
        </section>
        </>
    )
}