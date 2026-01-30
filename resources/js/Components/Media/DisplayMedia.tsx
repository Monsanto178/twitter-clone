import {ClassifyMedia} from './ClassifyMedia';
type Preview = {
    mimeType: string;
    url: string;
}

type DisplayType = 'Edit' | 'View';

interface Props {
    mediaArr: Array<Preview>;
    replying: boolean;
    type: DisplayType;
    deleteFile?: (index: number) => void;
    handleClick: (index: number) => void;
}

export const DisplayMedia = ({mediaArr, replying, type='View', deleteFile=() => {}, handleClick}: Props) => {
    function setClassify(element:Preview, idx:number=0) {
        if (type === 'View') {
            return (
                <> <ClassifyMedia media={element} actions={{index: idx, handleClick: handleClick}}/> </>
            )
        }
        return (
            <> <ClassifyMedia media={element}/> </>
        )
    }

    if(mediaArr.length<1) return;
    if(mediaArr.length%2 === 0) {
        return (
            <>
            {mediaArr.map((el, idx) => {
                return (
                    <picture key={idx} className={`relative overflow-hidden bg-black w-[49%] ${mediaArr.length === 2 ? 'h-[25rem] max-h-full' : 'h-[12.5rem] max-h-1/2 sm:max-h-full'} flex items-center gap-1`}>
                        {setClassify(el, idx)}
                        {type === 'Edit' &&
                            <button onClick={() => {deleteFile(idx)}} className="absolute bg-[#000000bd] p-2 top-[0.25rem] right-[0.25rem] rounded-[50%] transition-all duration-300 ease-in-out hover:scale-110 hover:bg-black cursor-pointer z-40">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                            </button>
                        }
                        {type === 'Edit' && el.mimeType.startsWith('image') && 
                            <button onClick={() => {handleClick(idx)}} className="absolute bg-[#000000bd] p-2 top-[0.25rem] left-[0.25rem] rounded-[50%] transition-all duration-300 ease-in-out hover:scale-110 hover:bg-black cursor-pointer z-99">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                            </button>
                        }
                    </picture>
                )
            })}
            </>
        )
    } else {
        return(
            <>
            <div className={`flex items-center bg-black overflow-hidden ${mediaArr.length === 3 ? 'w-[49%] sm:w-[60%] h-full' : replying ? 'w-full h-[27rem]' : 'w-full h-full'}`}>
                <picture className="relative w-full h-full">
                     {setClassify(mediaArr[0], 0)}
                    {type === 'Edit' &&
                        <button onClick={() => {deleteFile(0)}} className="absolute bg-[#000000bd] p-2 top-[0.25rem] right-[0.25rem] rounded-[50%] transition-all duration-300 ease-in-out hover:scale-110 hover:bg-black cursor-pointer z-40">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                        </button>
                    }
                    {type === 'Edit' && mediaArr[0].mimeType.startsWith('image') && 
                        <button onClick={() => {handleClick(0)}} className="absolute bg-[#000000bd] p-2 top-[0.25rem] left-[0.25rem] rounded-[50%] transition-all duration-300 ease-in-out hover:scale-110 hover:bg-black cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                        </button>
                    }
                </picture>
            </div>
            {mediaArr.length>1 &&
                <div className="flex flex-col w-[49%] sm:w-[39%] h-full justify-start gap-1">
                {mediaArr.map((el, idx) => {
                    if (idx !== 0) {
                        return (
                            <picture key={idx} className={`relative overflow-hidden bg-black h-full flex items-center gap-1`}>
                                {setClassify(el, idx)}
                                {type === 'Edit' &&
                                    <button onClick={() => {deleteFile(idx)}} className="absolute bg-[#000000bd] p-2 top-[0.25rem] right-[0.25rem] rounded-[50%] transition-all duration-300 ease-in-out hover:scale-110 hover:bg-black cursor-pointer z-40">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                                    </button> 
                                }
                                {type === 'Edit' && el.mimeType.startsWith('image') && 
                                    <button onClick={() => {handleClick(idx)}} className="absolute bg-[#000000bd] p-2 top-[0.25rem] left-[0.25rem] rounded-[50%] transition-all duration-300 ease-in-out hover:scale-110 hover:bg-black cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
                                    </button>
                                }
                            </picture>
                        )
                    }
                })}
                </div>
            }
            </>
        )
    }
}