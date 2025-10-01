import { Post, CommentBox} from "../Components";
import content from '../../assets/content.jpg';
import cover from '../../assets/cover.jpg';
import example_video from '../../assets/video_example.mp4';
import img_example_1 from '../../assets/img_example_1.jpg';
// import img_example_2 from '../../assets/img_example_2.jpg';

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
// const contenido4 = {
//     data:img_example_2,
//     mimeType: 'image/jpg'
// }

type User = {
    cover_img: string;
    user_name: string;
    user_alias: string;
    biography?: string;
    following: number;
    followers: number;
    creation_date?: string;
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
    media:[contenido3, contenido2, contenido]

}


export default function Home() {
    return (
        <>
            <CommentBox cover_img={Posteo.cover_img}/>
            <Post post={Posteo}/>
        </>
        )
}