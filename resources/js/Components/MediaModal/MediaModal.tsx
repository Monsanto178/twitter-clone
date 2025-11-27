import React, { ReactNode, useState } from "react";

type Media = {
    url: string | null;
    public_id?: string;
    order?: number;
    mimeType: string;
}

type Props = {
    mediaData: Array<Media>
    current: number;
    setOpenModal: (open:boolean) => void
}

export const MediaModal = ({mediaData, current=0, setOpenModal}: Props) => {
    const [currentMedia, setCurrentMedia] = useState(current);
    const closeModal = () => {
        setOpenModal(false);
        document.body.style.overflow = 'auto';
    };

    const nextMedia = () => {
        if(currentMedia+1 > mediaData.length) return
        setCurrentMedia(currentMedia + 1);
    }
    const previousMedia = () => {
        if(currentMedia === 0) return
        setCurrentMedia(currentMedia - 1);
    }

    const classifyMedia = (media:Media):ReactNode => {
        if (!media.url) return;

        if(media.mimeType.startsWith('video/')) {
            return <video src={media.url} controls className={`w-full h-auto object-cover transition-all duration-300 ease-in-out`} style={{translate: `${-100 * currentMedia}%`}}></video>
        }
        if(media.mimeType.startsWith('image/')) {
            return (
                <img src={media.url} alt="media_content" className={`w-full h-auto object-contain transition-all duration-300 ease-in-out`} style={{translate: `${-100 * currentMedia}%`}}/>
            )
        }
    }
    return(
        <div onClick={(e) => {closeModal(); e.stopPropagation();}} className="w-full h-screen fixed inset-0 flex justify-center items-center">
            <div className="fixed inset-0 bg-black opacity-85 w-screen h-screen"></div>
            <div onClick={(e) => e.stopPropagation()} className="fixed">
                <button onClick={closeModal} className="absolute hidden md:block p-4 top-[-3rem] right-[-10rem] rounded-[50%] transition-all duration-300 ease-in-out hover:bg-[#87878770] cursor-pointer z-99">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
                {currentMedia > 0 && 
                    <button onClick={() => previousMedia()} className="absolute top-60 hidden md:block left-0 md:left-[-5rem] lg:left-[-10rem] p-4 rounded-[50%] cursor-pointer hover:bg-[#87878770]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left-icon lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                }

                <div className="relative flex overflow-hidden rounded-[20px] max-w-none h-screen md:max-w-[600px] md:h-auto bg-black md:bg-transparent">
                    <button onClick={closeModal} className="absolute block md:hidden p-4 top-[1rem] right-[1rem] rounded-[50%] transition-all duration-300 ease-in-out hover:bg-[#87878770] cursor-pointer z-99">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                    
                    {currentMedia > 0 && 
                        <button onClick={() => previousMedia()} className="absolute block md:hidden top-[45%] left-[0.25rem] p-2 rounded-[50%] cursor-pointer hover:bg-[#87878770] z-99">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left-icon lucide-chevron-left"><path d="m15 18-6-6 6-6"/></svg>
                        </button>
                    }
                    
                    {mediaData.map((el, idx) => {
                        return (
                            <React.Fragment key={idx}>
                                {classifyMedia(el)}
                            </React.Fragment>
                        )
                    })}

                    {currentMedia < mediaData.length-1 && 
                        <button onClick={() => {nextMedia()}} className="absolute block md:hidden top-[45%] right-[0.25rem] p-2 rounded-[50%] cursor-pointer hover:bg-[#87878770] z-99">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                    }
                </div>
                {currentMedia < mediaData.length-1 && 
                    <button onClick={() => {nextMedia()}} className="absolute top-60 hidden md:block right-0 md:right-[-5rem] lg:right-[-10rem] p-4 rounded-[50%] cursor-pointer hover:bg-[#87878770]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right-icon lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                }
            </div>
        </div>
    )
}