import { useEffect, useRef, useState } from "react";
import { EditModal } from "../MediaModal/EditModal";
import React from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { fetchData } from "../../Utils";
import defaultAvatar from "../../../assets/user_avatar_default.png";
import { useReplyContext } from "../../Context/ReplyContext";
import { DisplayMedia } from "../../Components/Media/DisplayMedia";

type Emoji = {
  id: string;
  name: string;
  native: string;
  unified: string;
  shortcodes: string;
  keywords?: string[];
};

type Preview = {
    mimeType: string;
    url: string;
}

type MediaEditing = {
    src: string;
    idx: number
}

type ToUpdate = {
    img: File;
    idx: number;
}

type Props = {
    cover_img: string;
    replying?:boolean;
    replyTo?:{postId: string, username: string} | null;
    modalOpen?: (close:boolean) => void;
}

export const CommentBox = ({modalOpen, cover_img, replying=false, replyTo=null}:Props) => {
    const [TextAreaValue, setTextAreaValue] = useState<string>('');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [emojiBoxVisible, setEmojiBoxVisible] = useState(false);
    const emojiBoxRef = useRef<HTMLDivElement>(null);

    const [urlPreview, setUrlPreview] = useState<Preview[] | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const inputFileRef = useRef<HTMLInputElement>(null);

    const [curMediaEditing, setCurMediaEditing] = useState<MediaEditing | null>(null);
    const [updateFile, setUpdateFile] = useState<ToUpdate | null>(null);

    const [sendModal, setSendModal] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isSended, setIsSended] = useState(false);

    const {setReloadReply} = useReplyContext();



    const handleEditFile = async (idx:number) => {
        if(!urlPreview) return;
        const image = urlPreview[idx];

        if(!image.mimeType.startsWith('image')) return;
        setCurMediaEditing({src:image.url, idx: idx});
        setIsEditing(true);
        document.body.style.overflow = 'hidden';
    }
    
    // const classifyMedia = (media:Preview):ReactNode => {
    //     if (!media) return;

    //     if(media.mimeType.startsWith('video/')) {
    //         return <video src={media.src} controls className="w-full h-full object-cover transition-all duration-300 ease-in-out hover:scale-110"></video>
    //     }
    //     if(media.mimeType.startsWith('image/')) {
    //         return <img src={media.src} alt="media_content" className="w-full h-full object-cover transition-all duration-300 ease-in-out hover:scale-110"/>
    //     }
    // }

    const clearInputs = () => {
        if(!isSended) return;

        if(textareaRef.current) {
            textareaRef.current.value = '';
            setTextAreaValue('');
        }
        if(inputFileRef.current) {
            const emptyFileList = new DataTransfer();
            inputFileRef.current.files = emptyFileList.files;
            setUrlPreview(null);
            
        }
    }

    const deleteFile = (idx:number) => {
        if(!urlPreview) return;
        if(!inputFileRef.current) return;

        const newArr: Preview[] = [];
        URL.revokeObjectURL(urlPreview[idx].url);

        urlPreview.map((el) => {
            if(el.url === urlPreview[idx].url) return;

            newArr.push(el);
        })
        
        setUrlPreview(newArr);

        const currentFiles = inputFileRef.current.files;
        const dataTransfer = new DataTransfer();

        if(!currentFiles) return;
        Array.from(currentFiles).forEach((file, i) => {
            if(i !== idx) dataTransfer.items.add(file);
        })

        inputFileRef.current.files = dataTransfer.files;
    }

    // const displayMedia = (mediaArr:Array<Preview>) => {
    //     if(mediaArr.length<1) return;
    //     if(mediaArr.length%2 === 0) {
    //         return (
    //             <>
    //             {mediaArr.map((el, idx) => {
    //                 return (
    //                     <picture key={idx} className={`relative overflow-hidden bg-black w-[49%] ${mediaArr.length === 2 ? 'h-[25rem]' : 'h-[12.5rem]'} flex items-center gap-1`}>
    //                         {classifyMedia(el)}
    //                         <button onClick={() => {deleteFile(idx)}} className="absolute bg-[#000000bd] p-2 top-[0.25rem] right-[0.25rem] rounded-[50%] transition-all duration-300 ease-in-out hover:scale-110 hover:bg-black cursor-pointer z-99">
    //                             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    //                         </button>
    //                         {el.mimeType.startsWith('image') && 
    //                             <button onClick={() => {handleEditFile(idx)}} className="absolute bg-[#000000bd] p-2 top-[0.25rem] left-[0.25rem] rounded-[50%] transition-all duration-300 ease-in-out hover:scale-110 hover:bg-black cursor-pointer z-99">
    //                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
    //                             </button>
    //                         }
    //                     </picture>
    //                 )
    //             })}
    //             </>
    //         )
    //     } else {
    //         return(
    //             <>
    //             <div className={`flex items-center bg-black overflow-hidden ${mediaArr.length === 3 ? 'w-[60%] h-[25rem]' : replying ? 'w-full h-[27rem]' : 'w-full h-full'}`}>
    //                 <picture className="relative w-full h-full">
    //                     {classifyMedia(mediaArr[0])}
    //                     <button onClick={() => {deleteFile(0)}} className="absolute bg-[#000000bd] p-2 top-[0.25rem] right-[0.25rem] rounded-[50%] transition-all duration-300 ease-in-out hover:scale-110 hover:bg-black cursor-pointer">
    //                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    //                     </button>
    //                         {mediaArr[0].mimeType.startsWith('image') && 
    //                             <button onClick={() => {handleEditFile(0)}} className="absolute bg-[#000000bd] p-2 top-[0.25rem] left-[0.25rem] rounded-[50%] transition-all duration-300 ease-in-out hover:scale-110 hover:bg-black cursor-pointer">
    //                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
    //                             </button>
    //                         }
    //                 </picture>
    //             </div>
    //             {mediaArr.length>1 &&
    //                 <div className="flex flex-col w-[39%] gap-1">
    //                 {mediaArr.map((el, idx) => {
    //                     if (idx !== 0) {
    //                         return (
    //                             <picture key={idx} className={`relative overflow-hidden bg-black h-[12.5rem] flex items-center gap-1`}>
    //                                 {classifyMedia(el)}
    //                                 <button onClick={() => {deleteFile(idx)}} className="absolute bg-[#000000bd] p-2 top-[0.25rem] right-[0.25rem] rounded-[50%] transition-all duration-300 ease-in-out hover:scale-110 hover:bg-black cursor-pointer">
    //                                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-icon lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    //                                 </button>    
    //                                 {el.mimeType.startsWith('image') && 
    //                                     <button onClick={() => {handleEditFile(idx)}} className="absolute bg-[#000000bd] p-2 top-[0.25rem] left-[0.25rem] rounded-[50%] transition-all duration-300 ease-in-out hover:scale-110 hover:bg-black cursor-pointer">
    //                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pencil-icon lucide-pencil"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>
    //                                     </button>
    //                                 }
    //                             </picture>
    //                         )
    //                     }
    //                 })}
    //                 </div>
    //             }
    //             </>
    //         )
    //     }
    // }

    const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if(event.target.value.length>300) return;

        setTextAreaValue(event.target.value);
    };

    const handleClickOutside = (event:MouseEvent) => {
        if (emojiBoxRef.current && !emojiBoxRef.current.contains(event.target as Node)) {
            setEmojiBoxVisible(false);
        }
    }

    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if(!files) return;
        if(files.length<1) return;

        const filesArr = Array.from(files);
        
        const urlArr:Preview[] = [];
        filesArr.map((file) => {
            const url = URL.createObjectURL(file);
            urlArr.push({url:url, mimeType:file.type})
        })

        setUrlPreview(urlArr);
    }

    const handleFileClick = () => {
        if(!inputFileRef.current) return;

        inputFileRef.current.click();
    }

    const extractData = () => {
        if(!inputFileRef.current) return;
        if(!textareaRef.current) return;

        const files = inputFileRef.current.files;
        const text = textareaRef.current.value;
        const formData = new FormData();
        formData.append('text', text);

        if (replying && replyTo?.postId) {
            formData.append('parent', replyTo.postId);
        }

        if(files) {
            console.log(files);
            
            for (let i = 0; i < files.length; i++) {
                formData.append('files[]', files[i])
            }
        }

        return formData;
    }

    const sendPost = async () => {
        const data = extractData();
        if(!data) return;
        
        try {
            setIsSending(true);

            await fetchData<void>('/api/create/post', 'POST', data);

            setIsSended(true);
        } catch (error) {
            setIsSended(false);
            console.error(error);
            return {error:true}
        } finally {
            setIsSending(false);
            setSendModal(true);
        }
    }

    useEffect(() => {
        if(!curMediaEditing) return;
        if(!urlPreview) return;
        
        urlPreview[curMediaEditing.idx].url = curMediaEditing.src
        setUrlPreview((prev) => {
            if(!prev) return prev;
            const update = [...prev];

            update[curMediaEditing.idx].url = curMediaEditing.src;

            return update;
        })

    }, [curMediaEditing])

    useEffect(() => {        
        if (emojiBoxVisible) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [emojiBoxVisible])

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [TextAreaValue]);

    useEffect(() => {
        if(!updateFile) return;
        if(!inputFileRef.current) return;

        const currentFiles = inputFileRef.current.files;
        const dataTransfer = new DataTransfer();

        if(!currentFiles) return;
        Array.from(currentFiles).forEach((file, i) => {
            if(i !== updateFile.idx) {
                dataTransfer.items.add(file);
                return;
            };
            
            dataTransfer.items.add(updateFile.img);
        })

        inputFileRef.current.files = dataTransfer.files;

    }, [updateFile])

    return (
        <>
        <div className={`flex w-full gap-2 p-4 ${replying ? 'z-99' : ''}`}>
            <picture className="w-[50px] h-[50px] rounded-[50%] overflow-hidden group shrink-0">
                <img src={cover_img ? cover_img : defaultAvatar} alt="cover_img" className="w-full h-full" draggable={false}/>
            </picture>

            <div className="flex flex-col w-full">
                <div className="w-full text-[18px]">
                    {replying && 
                        <div className="text-[16px] pb-2 flex gap-x-2">
                            <span className="opacity-50">Replying to:</span>
                            <span className="text-blue-500">{replyTo?.username}</span>
                        </div>
                    }
                    <textarea itemID="replyComment" 
                        ref={textareaRef} value={TextAreaValue} 
                        onChange={handleChange} maxLength={300} 
                        className="w-full resize-none h-content outline-none" 
                        name="textContent" 
                        id="textArea" placeholder="¿What are you thinking right now?"></textarea>
                    <input 
                        ref={inputFileRef} type="file" 
                        onChange={handleFileChange} 
                        name="mediaFiles" 
                        className="hidden"
                        id="files" accept="video/*,image/*" multiple/>
                    
                    {urlPreview && 
                        <div className={`overflow-hidden rounded-[20px] justify-between items-stretch gap-1 flex flex-wrap`}>
                            <DisplayMedia mediaArr={urlPreview} 
                                deleteFile={deleteFile}
                                handleClick={handleEditFile} 
                                replying={replying}
                                type="Edit"
                            />
                        </div>
                    }
                </div>

                <div className="relative flex justify-between pt-2">
                    <div className="flex justify-between gap-4">
                        <button onClick={handleFileClick} className="flex transition-all duration-300 ease-in-out hover:scale-115 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E17564" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-image-icon lucide-image"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                        </button>

                        <button className="flex transition-all duration-300 ease-in-out hover:scale-115 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none"><path fill="#E17564" d="M10.988 11.798v.781a2.8 2.8 0 0 1-.351 1.45a2.4 2.4 0 0 1-.984.931c-.44.224-.93.336-1.423.325a3.1 3.1 0 0 1-1.581-.395a2.7 2.7 0 0 1-1.054-1.133A3.75 3.75 0 0 1 5.208 12c-.006-.473.07-.943.228-1.388a2.9 2.9 0 0 1 .633-1.028c.269-.283.595-.504.957-.65c.374-.15.775-.225 1.178-.22c.343-.002.684.051 1.01.159c.297.1.576.248.825.439c.24.19.443.422.598.685c.155.27.256.57.298.878H9.557a1.4 1.4 0 0 0-.175-.404a1.1 1.1 0 0 0-.29-.298a1.2 1.2 0 0 0-.387-.194a1.7 1.7 0 0 0-.483-.035c-.31-.01-.615.073-.878.237a1.6 1.6 0 0 0-.571.712c-.15.358-.223.745-.211 1.133c-.008.388.06.773.202 1.133c.123.287.324.533.58.712c.26.17.567.256.878.246c.27.008.539-.05.782-.167a1.15 1.15 0 0 0 .518-.492c.108-.206.165-.435.167-.668H8.283v-.992zm2.462-2.882v6.211a.09.09 0 0 1-.087.088h-1.177a.08.08 0 0 1-.065-.023a.08.08 0 0 1-.023-.065v-6.21a.08.08 0 0 1 .053-.085a.1.1 0 0 1 .035-.003h1.177a.09.09 0 0 1 .088.087m1.108 6.211v-6.21a.09.09 0 0 1 .088-.088h4.146v1.115h-2.758a.09.09 0 0 0-.088.088v1.344a.1.1 0 0 0 .088.088h2.512v1.115h-2.512a.09.09 0 0 0-.088.088v2.46a.08.08 0 0 1-.088.088h-1.177a.09.09 0 0 1-.087-.009a.09.09 0 0 1-.036-.079"/><path stroke="#E17564" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16.625 3.75h-9.25c-2.554 0-4.625 2.052-4.625 4.583v7.334c0 2.531 2.07 4.583 4.625 4.583h9.25c2.554 0 4.625-2.052 4.625-4.583V8.333c0-2.531-2.07-4.583-4.625-4.583"/></g></svg>
                        </button>

                        <button onClick={() => setEmojiBoxVisible(prev => !prev)} className="flex transition-all duration-300 ease-in-out hover:scale-115 cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E17564" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-smile-icon lucide-smile"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/></svg>
                        </button>
                        <div ref={emojiBoxRef} className={`absolute z-99 top-[2rem] transition-all duration-500 ease-in-out ${emojiBoxVisible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                            <Picker 
                                data={data}
                                previewPosition='none'
                                theme='dark'
                                onEmojiSelect={(e:Emoji) => {setTextAreaValue(prev => prev + e.native)}}
                            />
                        </div>
                    </div>

                    <button 
                        onClick={() => {sendPost()}}
                        className={`flex items-center justify-center ${isSending ? 'bg-[#872341] cursor-wait' :'bg-[#BE3144] hover:bg-[#872341] cursor-pointer'} px-6 py-2 rounded-[20px]`} disabled={isSending ? true : false}>
                        <strong>Tweet</strong>
                    </button>
                </div>
            </div>
        </div>
        <article className={`transition-all duration-500 ease-in-out ${isEditing ? 'opacity-100 z-9999' : 'opacity-0'}`}>
            {isEditing && urlPreview && curMediaEditing &&
                <EditModal src={curMediaEditing.src} idx={curMediaEditing.idx} setCurMediaEditing={setCurMediaEditing} setIsEditing={setIsEditing} replyingModal={replying} setUpdateFile={setUpdateFile}/>
            }
        </article>
        <article className={`transition-all duration-500 ease-in-out ${sendModal ? 'opacity-100 z-9999' : 'opacity-0'}`}>
            {sendModal &&
            <div className="w-screen h-screen fixed inset-0 flex justify-center items-center z-999 bg-[#000000cc]">
                <div className="top-1/2 left-1/2 z-9999 p-8 min-w-[300px] max-h-[200px] bg-[#00224D] flex flex-col justify-between items-center gap-y-4 rounded-[10px]">
                    <div>
                        <span>{`${isSended ? '¡Post has been created successfully!' : 'Oops...Something went wrong'}`}</span>
                    </div>
                    <button
                        onClick={() => {
                            setSendModal(false); 
                            setIsSended(false);
                            if (modalOpen) {
                                modalOpen(false)
                                setReloadReply(true);
                            };
                            clearInputs();
                        }}
                        className="p-2 transition-all duration-300 ease-in-out rounded-[15px] hover:bg-white hover:text-black hover:font-[600] cursor-pointer">
                            Accept
                    </button>
                </div>
            </div>
            }
        </article>
        </>
    )
}