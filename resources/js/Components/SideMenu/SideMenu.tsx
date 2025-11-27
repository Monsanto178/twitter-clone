import { Link, usePage } from "@inertiajs/react";
import { CommentModal } from "../../Components/CommentModal/CommentModal";
import { useState } from "react";

type Props = {
    currentSelect: string;
}

export const SideMenu = ({currentSelect}:Props) => {
    const profileId = (usePage().props.auth_user as {id: string}).id;
    const [isMCommentOpen, setIsMCommentOpen] = useState(false);



    return (
        <>
        <aside className="sticky top-4 h-full flex flex-col gap-y-4 text-[20px] px-0 md:px-2 z-996">
            <article className="flex flex-col">
                <Link href="/home" className={`${currentSelect === 'Home' ? 'bg-[#f0f0f0] text-black' : 'hover:bg-[#82828269]'} flex w-fit md:w-auto gap-x-2 items-center transition-all duration-500 ease-in-out p-4 rounded-[25px]`}>
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={`${currentSelect === 'Home' ? '#000000' : '#ffffff'}`} 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="lucide lucide-house-icon lucide-house">
                            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/>
                            <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    </svg>
                    <span className="hidden md:block">Home</span>
                </Link>
                {/* <Link href="/notifications" className={`${currentSelect === 'Notifications' ? 'bg-[#f0f0f0] text-black' : 'hover:bg-[#82828269]'} flex w-fit md:w-auto gap-x-2 items-center transition-all duration-500 ease-in-out p-4 rounded-[25px]`}>
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={`${currentSelect === 'Notifications' ? '#000000' : '#ffffff'}`} 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="lucide lucide-bell-icon lucide-bell">
                            <path d="M10.268 21a2 2 0 0 0 3.464 0"/>
                            <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>
                    </svg>
                    <span className="hidden md:block">Notifications</span>
                </Link>
                <Link href="" className={`${currentSelect === 'Messages' ? 'bg-[#f0f0f0] text-black' : 'hover:bg-[#82828269]'} flex w-fit md:w-auto gap-x-2 items-center transition-all duration-500 ease-in-out p-4 rounded-[25px]`}>
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={`${currentSelect === 'Message' ? '#000000' : '#ffffff'}`} 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="lucide lucide-mail-icon lucide-mail">
                            <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/>
                    </svg>
                    <span className="hidden md:block">Messages</span>
                </Link> */}
                <Link href={`/bookmarks`} className={`${currentSelect === 'BookmarkPage' ? 'bg-[#f0f0f0] text-black' : 'hover:bg-[#82828269]'} flex w-fit md:w-auto gap-x-2 items-center transition-all duration-500 ease-in-out p-4 rounded-[25px]`}>
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke={`${currentSelect === 'BookmarkPage' ? '#000000' : '#ffffff'}`}
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="lucide lucide-bookmark-icon lucide-bookmark">
                            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
                    </svg>
                    <span className="hidden md:block">Bookmarks</span>
                </Link>
                <Link href={`/profile/${profileId}`} className={`${currentSelect === 'Profile' ? 'bg-[#f0f0f0] text-black' : 'hover:bg-[#82828269]'} flex w-fit md:w-auto gap-x-2 items-center transition-all duration-500 ease-in-out p-4 rounded-[25px]`}>
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24"><g 
                        fill={`${currentSelect === 'Profile' ? '#000000' : '#ffffff'}`} fillRule="evenodd" clipRule="evenodd">
                            <path d="M16 9a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-2 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0"/>
                            <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1M3 12c0 2.09.713 4.014 1.908 5.542A8.99 8.99 0 0 1 12.065 14a8.98 8.98 0 0 1 7.092 3.458A9 9 0 1 0 3 12m9 9a8.96 8.96 0 0 1-5.672-2.012A6.99 6.99 0 0 1 12.065 16a6.99 6.99 0 0 1 5.689 2.92A8.96 8.96 0 0 1 12 21"/></g>
                    </svg>
                    <span className="hidden md:block">Profile</span>
                </Link>
                <Link href={`/logout`} className='hover:bg-[#82828269] flex w-fit md:w-auto gap-x-2 items-center transition-all duration-500 ease-in-out p-4 rounded-[25px]'>
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="#ffffff" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="lucide lucide-log-out-icon lucide-log-out">
                            <path d="m16 17 5-5-5-5"/>
                            <path d="M21 12H9"/>
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    </svg>
                    <span className="hidden md:block">Logout</span>
                </Link>
            </article>
            <article className="flex items-center justify-center">
                <button
                    onClick={(e) => {
                        setIsMCommentOpen(true);
                        document.body.style.overflow = 'hidden'; 
                        e.stopPropagation();
                    }}
                    className="w-12 h-12 md:w-50 md:h-15 flex items-center justify-center bg-[#BE3144] transition-all duration-300 ease-in-out hover:bg-[#872341] cursor-pointer rounded-[25px]">
                    <span className="hidden md:block">Tweet</span>
                    <svg className="block md:hidden" 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="24" 
                        height="24" 
                        viewBox="0 0 24 24">
                        <g fill="none" 
                        stroke="#fff" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="1.5">
                            <path d="M5.076 17C4.089 4.545 12.912 1.012 19.973 2.224c.286 4.128-1.734 5.673-5.58 6.387c.742.776 2.055 1.753 1.913 2.974c-.1.868-.69 1.295-1.87 2.147C11.85 15.6 8.854 16.78 5.076 17"/><path d="M4 22c0-6.5 3.848-9.818 6.5-12"/></g>
                    </svg>
                </button>
            </article>

            <div className={`transition-all duration-500 ease-in-out ${isMCommentOpen ? 'opacity-100 z-99' : 'opacity-0'}`}>
                {isMCommentOpen &&  
                    <CommentModal 
                        replying={false} 
                        setIsMcommentOpen={setIsMCommentOpen} 
                    />
                }
            </div>
        </aside>
        </>
    )
}