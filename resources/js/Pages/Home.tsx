import { Post, CommentBox} from "../Components";
import content from '../../assets/content.jpg';
import cover from '../../assets/cover.jpg';
import example_video from '../../assets/video_example.mp4';
import img_example_1 from '../../assets/img_example_1.jpg';
import { useEffect, useState } from "react";
import { PostType } from "Types";
// import img_example_2 from '../../assets/img_example_2.jpg';

type Media = {
    url: string;
    public_id?: string;
    order?: number;
    mimeType: string;
}
const contenido:Media = {
    url:example_video,
    mimeType: 'video/mp4'
}
const contenido2:Media = {
    url:content,
    mimeType: 'image/jpg'
}
const contenido3:Media = {
    url: img_example_1,
    mimeType: 'image/jpg'
}

type Props = {
    current_page: number,
    data: Array<PostType>,
    from: number,
    to: number,
    last_page: number
}

const Posteo: PostType = {
    id:1,
    replies:12,
    likes:15,
    reposts:3,
    liked_by_cur_profile:true,
    bookmarked_by_cur_profile:false,
    reposted_by_cur_profile:false,
    post_text:`La tecnología ha avanzado a pasos agigantados en las últimas décadas, transformando la manera en que vivimos, trabajamos y nos relacionamos. 
        Desde la aparición de Internet hasta los desarrollos más recientes en inteligencia artificial, hemos sido testigos de una revolución que no solo ha cambiado la economía global, sino que también ha alterado profundamente nuestras experiencias cotidianas. 
        Sin embargo, este progreso no está exento de desafíos y cuestionamientos, ya que surgen preguntas sobre cómo balancear la innovación con la ética, la privacidad y el impacto social. 
        Es fundamental que, al avanzar, tengamos en cuenta no solo el potencial de la tecnología, sino también sus posibles repercusiones en el futuro de la humanidad.`,
    created_at:'2025-11-06 00:39:29',
    user_profile: {
        user_id:'2',
        id:2,
        username:'@Joleas_12',
        name:'Jorge',
        avatar:cover,
    },
    media:[contenido3, contenido2, contenido]
}

const Posteo2: PostType = {
    id:2,
    replies:12,
    likes:15,
    reposts:3,
    liked_by_cur_profile:true,
    bookmarked_by_cur_profile:false,
    reposted_by_cur_profile:false,
    post_text:`La tecnología ha avanzado a pasos agigantados en las últimas décadas, transformando la manera en que vivimos, trabajamos y nos relacionamos. 
        Desde la aparición de Internet hasta los desarrollos más recientes en inteligencia artificial, hemos sido testigos de una revolución que no solo ha cambiado la economía global, sino que también ha alterado profundamente nuestras experiencias cotidianas. 
        Sin embargo, este progreso no está exento de desafíos y cuestionamientos, ya que surgen preguntas sobre cómo balancear la innovación con la ética, la privacidad y el impacto social. 
        Es fundamental que, al avanzar, tengamos en cuenta no solo el potencial de la tecnología, sino también sus posibles repercusiones en el futuro de la humanidad.`,
    created_at:'2025-11-06 00:39:29',
    user_profile: {
        user_id:'1',
        id:3,
        username:'@Joleas_12',
        name:'Jorge',
        avatar:cover,
    },
    media:[]
}


export default function Home() {
    return (
        <>
            <CommentBox cover_img={Posteo.user_profile.avatar}/>
            <Post post={Posteo} selected={false}/>
            <Post post={Posteo2} selected={false}/>
        </>
        )
}