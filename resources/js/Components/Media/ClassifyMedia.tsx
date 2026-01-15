import { ReactNode } from "react";

type Preview = {
    mimeType: string;
    url: string;
}

interface Props {
    media: Preview;
    actions?: {
        index: number;
        handleClick: (idx: number) => void;
    }
}

export const ClassifyMedia = ({media, actions}: Props):ReactNode => {
    if (!media) return;

    if(media.mimeType.startsWith('video/')) {
        return (
            <div className="relative flex w-full h-full group"
                onClick={() => {
                    if(actions) {
                        actions.handleClick(actions.index);
                    }
                }}>
                <video src={media.url} 
                    controls={false} 
                    className="w-full h-full object-cover cursor-pointer">
                </video>
                <div className="absolute inset-0 bg-black opacity-50 w-screen h-screen z-11"></div>
                <svg xmlns="http://www.w3.org/2000/svg" 
                    width="56" 
                    height="56" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    className="lucide lucide-circle-play-icon lucide-circle-play absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-scale duration-300 ease-in-out group-hover:scale-110 z-12">
                        <path d="M9 9.003a1 1 0 0 1 1.517-.859l4.997 2.997a1 1 0 0 1 0 1.718l-4.997 2.997A1 1 0 0 1 9 14.996z"/>
                        <circle cx="12" cy="12" r="10"/>
                </svg>
            </div>
            )
    }
    if(media.mimeType.startsWith('image/')) {
        return <img src={media.url}
            onClick={() => {
                if(actions) {
                    actions.handleClick(actions.index);
                }
            }}
            alt="media_content" 
            className="w-full h-full object-cover transition-all duration-300 ease-in-out hover:scale-110 cursor-pointer"/>
    }
}