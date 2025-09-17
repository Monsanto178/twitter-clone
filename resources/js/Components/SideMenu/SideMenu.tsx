

export const SideMenu = () => {
    return (
        <>
        <aside className="flex flex-col gap-y-4 text-[20px] px-2">
            <article className="flex flex-col font-">
                <a href="" className="flex gap-x-2 items-center transition-all duration-500 ease-in-out hover:bg-[#82828269] p-4 rounded-[25px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house-icon lucide-house"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
                    <span>Home</span>
                </a>
                <a href="" className="flex gap-x-2 items-center transition-all duration-500 ease-in-out hover:bg-[#82828269] p-4 rounded-[25px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell-icon lucide-bell"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>
                    <span>Notifications</span>
                </a>
                <a href="" className="flex gap-x-2 items-center transition-all duration-500 ease-in-out hover:bg-[#82828269] p-4 rounded-[25px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="#fff" fillRule="evenodd" clipRule="evenodd"><path d="M16 9a4 4 0 1 1-8 0a4 4 0 0 1 8 0m-2 0a2 2 0 1 1-4 0a2 2 0 0 1 4 0"/><path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11s11-4.925 11-11S18.075 1 12 1M3 12c0 2.09.713 4.014 1.908 5.542A8.99 8.99 0 0 1 12.065 14a8.98 8.98 0 0 1 7.092 3.458A9 9 0 1 0 3 12m9 9a8.96 8.96 0 0 1-5.672-2.012A6.99 6.99 0 0 1 12.065 16a6.99 6.99 0 0 1 5.689 2.92A8.96 8.96 0 0 1 12 21"/></g></svg>
                    <span>Messages</span>
                </a>
                <a href="" className="flex gap-x-2 items-center transition-all duration-500 ease-in-out hover:bg-[#82828269] p-4 rounded-[25px]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail-icon lucide-mail"><path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"/><rect x="2" y="4" width="20" height="16" rx="2"/></svg>
                    <span>Profile</span>
                </a>
            </article>
            <article>
                <button className="w-50 h-15 bg-[#BE3144] transition-all duration-300 ease-in-out hover:bg-[#872341] cursor-pointer rounded-[25px]">
                    <span>Tweet</span>
                </button>
            </article>   
        </aside>
        </>
    )
}