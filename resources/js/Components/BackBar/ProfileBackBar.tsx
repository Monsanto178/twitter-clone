import NumberFlow from "@number-flow/react"
import { FullUserType } from '@/Types/FullUserType'

type PaginatedStats = {
    current_page: number,
    total: number,
    last_page: number
}

interface Props {
    fullProfile: FullUserType;
    isFollowLoading: boolean;
    paginated: PaginatedStats | null;
    followBtn: () => void;
}

export const ProfileBackBar = ({fullProfile, paginated, isFollowLoading, followBtn}: Props) => {
    return (
        <section className="sticky top-0 z-80 bg-[#09122cd9] flex justify-between items-center py-2">
            <div className="absolute inset-0 backdrop-blur-[4px]"></div>
            <article className="flex items-center gap-x-4 z-81">
                <button 
                    className="cursor-pointer rounded-[50%] p-2 hover:bg-[#82828269] transition-all duration-300 ease-in-out"
                    onClick={() => {window.history.back()}
                    }>
                    <svg xmlns="http://www.w3.org/2000/svg" 
                        width="32" 
                        height="32" 
                        viewBox="0 0 24 24">
                        <g fill="none">
                            <path 
                                d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"
                            />
                            <path 
                                fill="#fff" 
                                d="M3.283 10.94a1.5 1.5 0 0 0 0 2.12l5.656 5.658a1.5 1.5 0 1 0 2.122-2.122L7.965 13.5H19.5a1.5 1.5 0 0 0 0-3H7.965l3.096-3.096a1.5 1.5 0 1 0-2.122-2.121z"
                            />
                        </g>
                    </svg>
                </button>
                <div className="flex flex-col">
                    <strong className="text-[20px]">{fullProfile.profile.name}</strong>
                    <div className="flex gap-2 text-[#ffffff7d]">
                        <NumberFlow value={`${paginated?.total ? paginated.total : 0}`}/>
                        <span>posts</span>
                    </div>
                </div>
            </article>
            {!fullProfile.own_profile && 
            <article className="z-81">
                <button
                    onClick={followBtn}
                    disabled={isFollowLoading}
                    className="flex w-20 h-12 items-center justify-center p-1 bg-[#BE3144] transition-all duration-300 
                        hover:bg-[#872341] rounded-[20px] cursor-pointer
                        disabled:cursor-wait disabled:bg-[#d97a8d] disabled:opacity-50">
                    <strong>{fullProfile.isFollowed ? 'Unfollow' : 'Follow'}</strong>
                </button>
            </article>
            }
        </section>
    )
}