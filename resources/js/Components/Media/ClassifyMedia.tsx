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
        return <video src={media.url} 
            onClick={() => {
                if(actions) {
                    actions.handleClick(actions.index);
                }
            }}
            controls 
            className="w-full h-full object-cover transition-all duration-300 ease-in-out hover:scale-110"></video>
    }
    if(media.mimeType.startsWith('image/')) {
        return <img src={media.url}
            onClick={() => {
                if(actions) {
                    actions.handleClick(actions.index);
                }
            }}
            alt="media_content" 
            className="w-full h-full object-cover transition-all duration-300 ease-in-out hover:scale-110"/>
    }
}