type User = {
    cover_img: string;
    user_name: string;
    user_alias: string;
    biography?: string;
    following: number;
    followers: number;
    creation_date?: string;
}

type Props = {
    user: User;
}

export const ProfileToolTip = ({user}:Props) => {
    return (
        <article className="absolute w-80 top-12 p-3 bg-[#040B20] flex flex-col gap-2 rounded-[15px]">
            <div className="flex justify-between">
                <picture className="w-[80px] h-[80px] rounded-[50%] overflow-hidden group">
                    <img src={user.cover_img} alt="cover_img" className="w-full h-full" draggable={false}/>
                </picture>

                <button className="flex w-20 h-12 items-center justify-center p-1 bg-[#BE3144] transition-all duration-300 hover:bg-[#872341] rounded-[20px] cursor-pointer">
                    <strong>Follow</strong>
                </button>
            </div>

            <div className="flex flex-col">
                <a href="">
                    <strong>{user.user_name}</strong>
                </a>
                <span>{user.user_alias}</span>
            </div>

            <div>
                <p>{user.biography}</p>
            </div>

            <div className="flex justify-between">
                <div className="flex gap-1">
                    <strong>{user.following}</strong>
                    <span>Following</span>
                </div>

                <div className="flex gap-1">
                    <strong>{user.followers}</strong>
                    <span>Followers</span>
                </div>
            </div>
        </article>
    )
}