import { UserType } from "@/Types";
import defaultAvatar from "@assets/user_avatar_default.png";
import bannerDefault from "@assets/banner_default.png";
import NumberFlow from "@number-flow/react";
import { useEffect, useRef, useState } from "react";
import { AvatarEditCard } from "./AvatarEditCard";
import { fetchData } from "@/Utils";
import { Spinner } from "@/Components";

type Props = {
    user: UserType;
    own_prof: boolean;
    id:string;
}
type editProps = {
    setEdit: (bool: boolean) => void;
    data: UserType;
    id: string;
}

const EditModal = ({setEdit, data, id}: editProps) => {
    const [name, setName] = useState(data.name);
    const [bio, setBio] = useState(data.bio);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const avatarRef = useRef<HTMLInputElement | null>(null);
    const bannerRef = useRef<HTMLInputElement | null>(null);

    const pic = data.avatar ? data.avatar : defaultAvatar;
    const banner = data.banner ? data.banner : bannerDefault;

    const [bannerBg, setBannerBg] = useState<string>(banner);
    const [avatarPic, setAvatarPic] = useState<string>(pic);
    const [newAvatarPic, setNewAvatarPic] = useState<string>('');
    const [editAvatar, setEditAvatar] = useState<boolean>(false);
    const [updateAvatar, setUpdateAvatar] = useState<File | null>(null);

    const [showModal, setShowModal] = useState<boolean>(false);
    const [successUpdate, setSuccessUpdate] = useState<boolean>(false);

    const [sending, setSending] = useState<boolean>(false);

    const handleChangeName = (e:React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
    }
    const handleChangeBio = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        setBio(e.target.value);
    }

    const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if(!files) return;

        const avatarUrl = URL.createObjectURL(files[0]);
        setNewAvatarPic(avatarUrl);
    }
    const handleBannerChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if(!files) return;

        const bannerUrl = URL.createObjectURL(files[0]);
        setBannerBg(bannerUrl);
    }

    const handleBannerBtn = () => {
        if(!bannerRef.current) return;

        bannerRef.current.click();
    }
    const handleAvatarBtn = () => {
        if(!avatarRef.current) return;
        
        avatarRef.current.click();
    }

    const extractData = (): FormData => {
        const newName = name;
        const newBio = bio as string;
        const newAvatar = avatarRef.current?.files;
        const newBanner = bannerRef.current?.files;
        
        const formData = new FormData();
        if(newName !== data.name) {formData.append('name', newName)};
        if(newBio !== data.bio) formData.append('bio', newBio);
        
        if(newAvatar && newAvatar?.length > 0) formData.append('avatar', newAvatar[0]);
        if(newBanner && newBanner?.length > 0) formData.append('banner', newBanner[0]);


        return formData;
    }


    const handleCancelBtn = () => {
        setEdit(false);
        setName(data.name);
        setBio(data.bio);
    }
    const handleConfirmBtn = async () => {
        const data = extractData();
        data.append('_method', 'PUT');
        if(!data) return;

        try {
            setSending(true);

            const response = await fetchData<boolean>('/api/profile/update', 'POST', data)
            if(!response) return;

            localStorage.removeItem(`profile_${id}`)
            setSuccessUpdate(true);
        } catch (error) {
            console.error(error);
            
            return {error:true}
        } finally {
            setShowModal(true);
            setSending(false);
        }
    }
    
    const handleModalBtn = () => {
        if(successUpdate) window.location.reload();
        setShowModal(false);
    }

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
    }, [bio]);

    useEffect(() => {
        if(!newAvatarPic) return;
        if(newAvatarPic.length < 1) return;
        
        setEditAvatar(true);
    }, [newAvatarPic])

    useEffect(() => {
        if(!updateAvatar) return;
        if(!avatarRef.current) return;

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(updateAvatar)
        avatarRef.current.files = dataTransfer.files;
        
        const newPicUrl  = URL.createObjectURL(updateAvatar);
        
        setAvatarPic(newPicUrl);
    }, [updateAvatar])
    return (
        <div
            onClick={(e) => {
                // handleCancelBtn(); 
                document.body.style.overflow = 'auto';
                e.stopPropagation();
            }}
            style={{zIndex:40000}}
            className="w-screen h-screen fixed inset-0 flex justify-center items-center">
                <div className="fixed inset-0 bg-black opacity-95 w-screen h-screen"></div>
                <div onClick={(e) => e.stopPropagation()} 
                    className="fixed flex flex-col bg-[#09122C] w-[95%] sm:w-[80%] max-w-[40rem] rounded-[20px] p-8 max-h-[100dvh] gap-y-4">
                    <div className="w-full h-full flex flex-col justify-center items-center gap-y-4 overflow-hidden">
                        <div className="relative h-0 w-full">
                            <div 
                                className={`absolute top-0 bg-cover bg-center p-60 w-full cursor-pointer z-[-1]`} 
                                style={{
                                    backgroundImage:`url('${bannerBg}')`, 
                                    backgroundSize:'cover', 
                                }}>
                                <div className="absolute inset-0 backdrop-blur-[1px] bg-black/80"></div>
                                <input 
                                    ref={bannerRef} type="file" 
                                    onChange={handleBannerChange} 
                                    name="banner" 
                                    className="hidden"
                                    id="bannerPic" accept="image/*"/>
                            </div>
                        </div>
                        <button onClick={handleBannerBtn}
                            className="absolute bg-[#000000bd] p-2 top-[2.7rem] right-[10%] sm:right-[8%] rounded-[50%] transition-all duration-300 ease-in-out hover:scale-110 hover:bg-black cursor-pointer z-99">
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                width="28" 
                                height="28" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="#ffffff" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="lucide lucide-pencil-icon lucide-pencil">
                                    <path 
                                        d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                                    <path d="m15 5 4 4"/>
                            </svg>
                        </button>
                        <div className="flex flex-col w-full justify-center items-center">
                            <label htmlFor="profAvatar">Avatar</label>
                            <picture 
                                id="profAvatar" 
                                onClick={handleAvatarBtn}
                                className="w-[100px] sm:w-[150px] w-[100px] sm:h-[150px] rounded-[50%] transition-all duration-300 ease-in-out overflow-hidden group bg-[#060c1e] cursor-pointer">
                                <img src={avatarPic} alt="cover_img" className="w-full h-full" draggable={false}/>
                            </picture>
                            <input 
                                ref={avatarRef} type="file" 
                                onChange={handleFileChange} 
                                name="avatar" 
                                className="hidden"
                                id="avatarPic" accept="image/*"/>
                        </div>
                        <div className="flex flex-col w-full justify-center items-center">
                            <label htmlFor="userN">Name</label>
                            <input 
                                className="text-[20px] font-bold text-center border-b border-gray-500 p-2 rounded-sm"
                                type="text" 
                                name="userName" 
                                id="userN" 
                                maxLength={20}
                                onChange={(e) => {handleChangeName(e)}}
                                value={name}
                            />
                        </div>
                        <div className="flex flex-col w-full justify-center items-center">
                            <label htmlFor="profBio">Biography</label>
                            <textarea 
                                ref={textareaRef}
                                className="w-full overflow-hidden resize-none text-center border-b border-gray-500 p-2 rounded-sm h-content outline-none"
                                maxLength={280}
                                name="bio" 
                                id="profBio"
                                onChange={(e) => {handleChangeBio(e)}}
                                value={bio}>
                            </textarea>
                        </div>
                    </div>

                    <div className="flex justify-between gap-y-3 right-0 top-12 sm:top-22 transition-all duration-300 ease-in-out">
                        <button
                            onClick={handleCancelBtn} 
                            className="w-12 h-12 md:w-30 md:h-12 flex items-center justify-center bg-[#BE3144] transition-all duration-300 ease-in-out hover:bg-[#872341] cursor-pointer rounded-[25px] overflow-hidden">
                            <span className="hidden md:block">Cancel</span>
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                width="26px" 
                                height="26px" 
                                viewBox="0 0 512 512"
                                className="md:hidden block"
                                >
                                <path fill="#fff" 
                                fillRule="evenodd" 
                                d="M420.48 121.813L390.187 91.52L256 225.92L121.813 91.52L91.52 121.813L225.92 256L91.52 390.187l30.293 30.293L256 286.08l134.187 134.4l30.293-30.293L286.08 256z" />
                            </svg>
                        </button>
                        <button 
                            onClick={handleConfirmBtn}
                            className="w-12 h-12 md:w-30 md:h-12 flex items-center justify-center bg-[#BE3144] transition-all duration-300 ease-in-out hover:bg-[#872341] cursor-pointer rounded-[25px] overflow-hidden">
                            <span className="hidden md:block">Confirm</span>
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                width="26px" 
                                height="26px" 
                                viewBox="0 0 2048 2048"
                                className="md:hidden block">
                                <path fill="#fff" d="M640 1755L19 1133l90-90l531 530L1939 275l90 90z" />
                            </svg>
                        </button>
                    </div>

                    {newAvatarPic.length > 0 && editAvatar &&
                        <AvatarEditCard src={newAvatarPic} setIsEditing={setEditAvatar} setUpdateFile={setUpdateAvatar}/>
                    }

                    {sending &&
                        <div
                            style={{zIndex:40002}}
                            className="w-screen h-screen fixed inset-0 flex justify-center items-center">
                                <div className="fixed inset-0 bg-black opacity-95 w-screen h-screen"></div>
                                <div style={{zIndex: 40003}}>
                                    <Spinner width="84" height="84"/>
                                </div>
                        </div>
                    }
                    {showModal && 
                        <div
                            style={{zIndex:40002}}
                            className="w-screen h-screen fixed inset-0 flex justify-center items-center">
                                <div className="fixed inset-0 bg-black opacity-95 w-screen h-screen"></div>
                                <div
                                    className="fixed flex flex-col justify-center items-center bg-[#09122C] w-[95%] sm:w-[80%] max-w-[25rem] rounded-[20px] p-8 max-h-[100dvh] gap-y-4"
                                    style={{zIndex: 40003}}>
                                    <div className="p-4">
                                        <span>{successUpdate ? 'Changes has been saved' : 'Oops... Something went wrong.'}</span>
                                    </div>
                                    <button
                                        className="w-30 h-12 flex items-center justify-center bg-[#BE3144] transition-all duration-300 ease-in-out hover:bg-[#872341] cursor-pointer rounded-[25px] overflow-hidden"
                                        onClick={handleModalBtn}>
                                            Accept
                                    </button>
                                </div>
                        </div>
                    }
                </div>
        </div>
    )
}

export const ProfileCard = ({user, own_prof, id}: Props) => {
    const [editProf, setEditProf] = useState(false);

    return (
        <>
        <section className="relative">
            <article 
                className={`absolute top-0 bg-cover bg-center p-40 w-full cursor-pointer`} 
                style={{
                    backgroundImage:`url('${user.banner ? user.banner : bannerDefault}')`, 
                    backgroundSize:'cover', 
                }}>
                <div className="absolute inset-0 backdrop-blur-[1px] bg-black/30"></div>
            </article>

            <article className="relative pt-70 sm:pt-60 px-4 z-10 flex flex-col gap-2 transition-all duration-300 ease-in-out">
                <div className="relative flex justify-between">
                    <div className="flex flex-col gap-2">
                        <picture className="w-[100px] sm:w-[150px] w-[100px] sm:h-[150px] rounded-[50%] transition-all duration-300 ease-in-out overflow-hidden group bg-[#060c1e]">
                            <img src={user.avatar ? user.avatar : defaultAvatar} alt="cover_img" className="w-full h-full" draggable={false}/>
                        </picture>
                        
                        <div className="flex flex-col">
                            <strong className="text-[20px]">{user.name}</strong>
                            <span className="text-[#ffffff7d]">@{user.username}</span>
                        </div>
                    </div>

                    {own_prof && !editProf &&
                    <div className="flex absolute right-0 top-12 sm:top-22 transition-all duration-300 ease-in-out">
                        <button
                            onClick={() => {setEditProf(true)}} 
                            className="w-12 h-12 md:w-50 md:h-12 flex items-center justify-center bg-[#BE3144] transition-all duration-300 ease-in-out hover:bg-[#872341] cursor-pointer rounded-[25px] overflow-hidden">
                            <span className="hidden md:block">Edit Profile</span>
                            <svg xmlns="http://www.w3.org/2000/svg" 
                                width="24" 
                                height="24" 
                                viewBox="0 0 24 24" 
                                fill="none" 
                                stroke="#ffffff" 
                                strokeWidth="2" 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                className="md:hidden block lucide lucide-pencil-icon lucide-pencil">
                                <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>
                                <path d="m15 5 4 4"/>
                            </svg>
                        </button>
                    </div>
                    }
                </div>

                <div className={`${user.bio ? 'block' : 'hidden'}`}>
                    <p>{user.bio}</p>
                </div>
                <div className="flex gap-8">
                    <div className="flex gap-2">
                        <strong>
                            <NumberFlow value={user.following}/>
                        </strong>
                        <span className="text-[#ffffff7d]">Following</span>
                    </div>
                    <div className="flex gap-2">
                        <strong>
                            <NumberFlow value={user.followers}/>
                        </strong>
                        <span className="text-[#ffffff7d]">Followers</span>
                    </div>
                </div>
            </article>
            {editProf &&
                <EditModal setEdit={setEditProf} data={user} id={id}/>
            }
        </section>
        </>
    )
}