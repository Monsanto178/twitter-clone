import { Post, ProfileCard } from "../Components";
import content from '../../assets/content.jpg';
import cover from '../../assets/cover.jpg';
import example_video from '../../assets/video_example.mp4';
import img_example_1 from '../../assets/img_example_1.jpg';
import { useState } from "react";

type Media = {
    data: string | null;
    mimeType: string;
}

const contenido = {
    data:example_video,
    mimeType: 'video/mp4'
}
const contenido2 = {
    data:content,
    mimeType: 'image/jpg'
}
const contenido3 = {
    data: img_example_1,
    mimeType: 'image/jpg'
}

type User = {
    cover_img: string;
    user_name: string;
    user_alias: string;
    biography?: string;
    following: number;
    followers: number;
    creation_date?: string;
    post_number: number;
    profile_banner:string | null;
    own_profile: boolean;
}

type Poste = User & {
    time_posted: string;
    post_text: string | null;
    comments: number;
    reposted: number;
    likes: number;
    media: Array<Media> | null
}

const Posteo: Poste = {
    comments:12,
    likes:15,
    post_text:`La tecnología ha avanzado a pasos agigantados en las últimas décadas, transformando la manera en que vivimos, trabajamos y nos relacionamos. 
        Desde la aparición de Internet hasta los desarrollos más recientes en inteligencia artificial, hemos sido testigos de una revolución que no solo ha cambiado la economía global, sino que también ha alterado profundamente nuestras experiencias cotidianas. 
        Sin embargo, este progreso no está exento de desafíos y cuestionamientos, ya que surgen preguntas sobre cómo balancear la innovación con la ética, la privacidad y el impacto social. 
        Es fundamental que, al avanzar, tengamos en cuenta no solo el potencial de la tecnología, sino también sus posibles repercusiones en el futuro de la humanidad.`,
    reposted:3,
    time_posted:'9 minutes ago',
    user_alias:'@Joleas_12',
    user_name:'Jorge',
    cover_img:cover,
    biography: 'Tecnólogo a tiempo completo. A veces no encuentro las llaves del auto.',
    followers: 125,
    following: 60,
    creation_date: '9th september, 2009',
    // media:[contenido, contenido2, contenido2]
    media:[contenido3, contenido2, contenido],
    post_number:34,
    profile_banner:img_example_1,
    own_profile:false
}


// type Post = User & {
//     time_posted: string;
//     post_text: string | null;
//     comments: number;
//     reposted: number;
//     likes: number;
//     media: Array<Media> | null
// }

type Props = {
    user: User;
}
type Options = 'Post' | 'Answers' | 'Multimedia' | 'Likes';

export default function Profile() {
    const [currentOpt, setCurrentOpt] = useState<Options>('Post');

    const usuario: User = {
        user_alias:'@Joleas_12',
        user_name:'Jorge',
        cover_img:cover,
        biography: 'Tecnólogo a tiempo completo. A veces no encuentro las llaves del auto.',
        followers: 125,
        following: 60,
        creation_date: '9th september, 2009',
        post_number:34,
        profile_banner:img_example_1,
        own_profile: false
    }
    return (
        <div className="px-4 py-2 gap-4 flex flex-col">
            <section className="flex justify-between items-center">
                <article className="flex flex-col">
                    <strong className="text-[20px]">{usuario.user_name}</strong>
                    <span className="text-[#ffffff7d]">{usuario.post_number} posts</span>
                </article>
                {usuario.own_profile && 
                <article>
                    <button className="flex w-20 h-12 items-center justify-center p-1 bg-[#BE3144] transition-all duration-300 hover:bg-[#872341] rounded-[20px] cursor-pointer">
                        <strong>Follow</strong>
                    </button>
                </article>
                }
            </section>

            <ProfileCard user={usuario}/>

            <section className="mx-0 sm:mx-4 relative">
                <div className="flex justify-between text-[16px] sm:text-[18px]">
                    <button 
                        onClick={() => {setCurrentOpt('Post')}} 
                        className={`${currentOpt === 'Post' ? 'font-[400] scale-105' : 'hover:scale-110'} transition-scale duration-300 ease-in-out cursor-pointer w-[25%]  p-2`}>
                            Post
                    </button>
                    <button 
                        onClick={() => {setCurrentOpt('Answers')}} 
                        className={`${currentOpt === 'Answers' ? 'font-[400] scale-105' : 'hover:scale-110'} transition-scale duration-300 ease-in-out cursor-pointer w-[25%]  p-2`}>
                            Answers
                    </button>
                    <button 
                        onClick={() => {setCurrentOpt('Multimedia')}} 
                        className={`${currentOpt === 'Multimedia' ? 'font-[400] scale-105' : 'hover:scale-110'} transition-scale duration-300 ease-in-out cursor-pointer w-[25%]  p-2`}>
                            Multimedia
                    </button>
                    <button 
                        onClick={() => {setCurrentOpt('Likes')}} 
                        className={`${currentOpt === 'Likes' ? 'font-[400] scale-105' : 'hover:scale-110'} transition-scale duration-300 ease-in-out cursor-pointer w-[25%]  p-2`}>
                            Likes
                    </button>
                </div>
                <div
                className="absolute bottom-0 left-0 w-[25%] h-[4px] bg-blue-500 transition-all duration-300 ease-in-out"
                style={{
                    left: currentOpt === 'Post' ? '0%' :
                            currentOpt === 'Answers' ? '25%' :
                            currentOpt === 'Multimedia' ? '50%' : '75%',
                }}
                />
            </section>

            <section>
                <Post post={Posteo}/>
            </section>
        </div>
    )
}