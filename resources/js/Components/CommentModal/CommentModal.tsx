import { useEffect, useState } from "react";
import { CommentBox } from "@/Components";
import defaultAvatar from "@assets/user_avatar_default.png";
import { fetchData } from "@/Utils";

interface Props {
    target?: {
        postId: string,
        username: string,
    } | null;
    setIsMcommentOpen: (bool: boolean) => void;
    replying:boolean;
}
type Response = {
    status: 'success' | 'error';
    code: number;
    message: string;
    error?: string;
    data?: {avatar: string};
}


export const CommentModal = ({target = null, replying = false, setIsMcommentOpen}: Props) => {
    const [profilePic, setProfilePic] = useState<string | null>(null)

    async function getProfPic() {
        try {
            const response = await fetchData<Response>('/getProfilePic', 'GET');

            if(response.data) setProfilePic(response.data.avatar);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        if(profilePic) return;

        getProfPic();
    }, [])
    return (
        <>
            <div onClick={(e) => {
                setIsMcommentOpen(false); 
                document.body.style.overflow = 'auto';
                e.stopPropagation();
                }} 
                className="w-screen h-screen fixed inset-0 flex justify-center items-center">
                <div className="fixed inset-0 bg-black opacity-85 w-screen h-screen"></div>
                <div onClick={(e) => e.stopPropagation()} 
                    className="fixed max-h-full bg-[#09122C] w-[95%] sm:w-[80%] max-w-[40rem] rounded-[20px]">
                    {<CommentBox
                        cover_img={profilePic ? profilePic : defaultAvatar}
                        replying={replying} 
                        replyTo={target}
                        modalOpen={setIsMcommentOpen}
                        />
                    }
                    <button onClick={() => {setIsMcommentOpen(false); document.body.style.overflow = 'auto';}} 
                        className="absolute p-4 top-[-4rem] sm:top-[-3rem] sm:right-[-3rem] rounded-[50%] transition-all duration-300 ease-in-out hover:bg-[#87878770] cursor-pointer z-99">
                        <svg xmlns="http://www.w3.org/2000/svg" 
                            width="32" 
                            height="32" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="#ffffff" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="lucide lucide-x-icon lucide-x">
                            <path d="M18 6 6 18"/>
                            <path d="m6 6 12 12"/>
                        </svg>
                    </button>
                </div>
            </div>
        </>
    )
}