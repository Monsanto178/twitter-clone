import { Notification, Post } from "../Components";
import img_example_1 from "../../assets/notification_example_1.jpg"
import img_example_2 from "../../assets/notification_example_2.jpg"
import img_example_3 from "../../assets/notification_example_3.jpg"
import img_example_4 from "../../assets/notification_example_4.jpg"


type Media = {
    data: string | null;
    mimeType: string;
}

type User = {
    cover_img: string;
    user_name: string;
    user_alias: string;
}

type Post = User & {
    time_posted: string;
    post_text: string | null;
    comments: number;
    reposted: number;
    likes: number;
    media: Array<Media> | null
}

type Notification = {
    type: 'Like' | 'Repost';
    users: Array<User>;
    quantity: number;
    post: Post
}


type Props = {
    notification: Array<Notification>;
}

export default function Notifications () {
  const notification:Array<Notification> = [
    {
      type: 'Like',
      users: [
        {
          cover_img: img_example_1,
          user_name: 'Ana Martínez',
          user_alias: 'ana_dev',
        },
        {
          cover_img: img_example_2,
          user_name: 'Carlos Pérez',
          user_alias: 'carlitox',
        },
      ],
      quantity: 2,
      post: {
        cover_img: img_example_2,
        user_name: 'Lucía Gómez',
        user_alias: 'lucia_code',
        time_posted: '2025-09-28T10:30:00Z',
        post_text: '¡Hoy aprendí TypeScript con React!',
        comments: 12,
        reposted: 3,
        likes: 56,
        media: [
          {
            data: '/media/image1.jpg',
            mimeType: 'image/jpeg',
          },
        ],
      },
    },
    {
      type: 'Repost',
      users: [
        {
          cover_img: img_example_3,
          user_name: 'Mario López',
          user_alias: 'mario_lo',
        },
      ],
      quantity: 1,
      post: {
        cover_img: img_example_2,
        user_name: 'Laura Sánchez',
        user_alias: 'laurasan',
        time_posted: '2025-09-27T14:00:00Z',
        post_text: 'Check out my latest project on GitHub 🚀',
        comments: 8,
        reposted: 15,
        likes: 120,
        media: null,
      },
    },
    {
      type: 'Like',
      users: [
        {
          cover_img: img_example_4,
          user_name: 'Pablo Díaz',
          user_alias: 'pablo_dz',
        },
      ],
      quantity: 1,
      post: {
        cover_img: img_example_1,
        user_name: 'Elena Ríos',
        user_alias: 'elenar',
        time_posted: '2025-09-26T09:45:00Z',
        post_text: 'Buenos días a todos 🌞',
        comments: 3,
        reposted: 0,
        likes: 34,
        media: [
          {
            data: '/media/image2.png',
            mimeType: 'image/png',
          },
        ],
      },
    },
    {
      type: 'Repost',
      users: [
        {
          cover_img: img_example_4,
          user_name: 'Sofía Méndez',
          user_alias: 'sofi_code',
        },
        {
          cover_img: img_example_3,
          user_name: 'Andrés Cruz',
          user_alias: 'andrescrz',
        },
        {
          cover_img: img_example_4,
          user_name: 'Sofía Méndez',
          user_alias: 'sofi_code',
        },
                {
          cover_img: img_example_4,
          user_name: 'Sofía Méndez',
          user_alias: 'sofi_code',
        },
        {
          cover_img: img_example_3,
          user_name: 'Andrés Cruz',
          user_alias: 'andrescrz',
        },
        {
          cover_img: img_example_4,
          user_name: 'Sofía Méndez',
          user_alias: 'sofi_code',
        },
                {
          cover_img: img_example_4,
          user_name: 'Sofía Méndez',
          user_alias: 'sofi_code',
        },
        {
          cover_img: img_example_3,
          user_name: 'Andrés Cruz',
          user_alias: 'andrescrz',
        },
        {
          cover_img: img_example_4,
          user_name: 'Sofía Méndez',
          user_alias: 'sofi_code',
        },
        
      ],
      quantity: 2,
      post: {
        cover_img: '/img/post_user4.jpg',
        user_name: 'Jorge Romero',
        user_alias: 'jorge_dev',
        time_posted: '2025-09-25T18:15:00Z',
        post_text: 'Me encanta trabajar con Tailwind CSS 😍',
        comments: 10,
        reposted: 5,
        likes: 89,
        media: null,
      },
    }];
    return (
        <>
            {notification.map((el, idx) => {
                return(<Notification key={idx} notification={el}/>)
            })}
        </>
    )
}