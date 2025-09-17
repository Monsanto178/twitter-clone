import { Post, SideMenu} from "../Components";
import content from '../../assets/content.jpg';
import cover from '../../assets/cover.jpg';
import example_video from '../../assets/video_example.mp4';
// import { ReactNode } from "react";

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

type Poste = {
    cover_img: string;
    user_name: string;
    user_alias: string;
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
    media:[contenido, contenido2, contenido, contenido2]
}


export default function Home() {
    return (
        <>
            <section className="bg-[#09122C] text-white h-full w-full flex justify-center px-80 py-20">
                <SideMenu />
                <Post post={Posteo}/>
            </section>
        </>
        )
}