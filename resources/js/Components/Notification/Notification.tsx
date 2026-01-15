// import { Post } from "@/Components";
import { UserType, PostType } from "@/Types"
import defaultAvatar from '@assets/user_avatar_default.png';
import React from "react";

//Not Implemented

type Notification = {
    type: 'Like' | 'Repost';
    users: Array<UserType>;
    quantity: number;
    post: PostType
}

type Props = {
    notification: Notification;
}

export const Notification = ({notification}:Props) => {
    const first_user = notification.users[0].name;
    const second_user = notification.users[1] ? notification.users[1].name : null;
    const users_lenght = notification.users.length;

    return (
        <>
        <article className="flex gap-2 border-b-1 border-white px-2 py-4 ml-4">
            <div>
                {notification.type === 'Like' && 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#E17564" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] md:h-[24px] md:w-[24px] lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>
                }
                {notification.type === 'Repost' && 
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#E17564" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] md:h-[24px] md:w-[24px] lucide lucide-repeat-icon lucide-repeat"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>
                }
            </div>

            <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                    {notification.users.map((el, idx) => {
                        if(idx > 9) return;
                        return(
                            <React.Fragment key={idx}>
                                <picture className="w-[30px] h-[30px] md:h-[40px] md:w-[40px] rounded-[50%] overflow-hidden group">
                                    <img src={el.avatar ? el.avatar : defaultAvatar} alt="cover_img" className="w-full h-full" draggable={false}/>
                                </picture>
                            </React.Fragment>
                        )
                    })}
                </div>
                <div className="leading-snug text-[15px]">
                    <strong>{first_user}</strong>

                    {users_lenght > 1 && 
                        <span> & </span>
                    }
                    {users_lenght === 2 && 
                        <strong>{second_user}</strong>
                    }
                    {users_lenght > 2 && 
                        <span>{users_lenght} more </span>
                    }

                    {notification.type === 'Like' && 
                        <span> indicated they like your post</span>
                    }
                    {notification.type === 'Repost' && notification.quantity === 1 && 
                        <span> reposted your post</span>
                    }
                    {notification.type === 'Repost' && notification.quantity > 1 && 
                        <span> have reposted your post</span>
                    }
                </div>

                <div className="text-[#ffffff7d]">
                    <p>{notification.post.post_text}</p>
                </div>
            </div>
        </article>
        </>
    )
}