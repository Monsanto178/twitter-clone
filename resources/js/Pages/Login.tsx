import { fetchData, getCsrfToken, getCookie } from "@/Utils"
import { ReducedUserType } from '@/Types'
import { Spinner, UserCard } from "@/Components"
import React, { useEffect, useState } from "react"
import cover from '@assets/user_avatar_default.png';

export default function Login() {
    const [profiles, setProfiles] = useState<Array<ReducedUserType> | null>(null);
    const [errorProf, setErrorProf] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const fetchProfiles = async() => {
        try {
            const data = await fetchData<Array<ReducedUserType>>('/api/profiles', 'GET');     
            
            setProfiles(data);
        } catch {
            setErrorProf('Failed to load profiles. Please reload the page')
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(!profiles) {
            fetchProfiles();
            setLoading(false)
        };

        if(getCookie('XSRF-TOKEN')) return;
        getCsrfToken();
    }, [])

    useEffect(() => {
        if (!profiles) return

        profiles.map((prof) => {
            prof.avatar = prof.avatar ? prof.avatar : cover;
        })
    }, [profiles])
 return (
    <section className="flex flex-col justify-center items-center">
        <article className="flex flex-col gap-y-15 justify-center items-center">
            <div className="flex flex-col items-center gap-y-5">
                <strong>Welcome to Whitter</strong>
                <span>Please select your account</span>
            </div>
            
            <div className="flex gap-x-8">
                {loading && 
                    <Spinner width="64" height="64"/>
                }
                {!loading && profiles && 
                    profiles.map((profile, idx) => {
                        return (
                            <React.Fragment key={idx}>
                                <UserCard profile={profile}/>
                            </React.Fragment>
                        )
                    })
                }
                {!loading && errorProf && 
                    <div className="flex flex-col justify-center items-center gap-y-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 16 16">
                            <path fill="#fff" fillRule="evenodd" d="M8 14.5a6.5 6.5 0 1 0 0-13a6.5 6.5 0 0 0 0 13M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m1-5a1 1 0 1 1-2 0a1 1 0 0 1 2 0m-.25-6.25a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 1.5 0z" clipRule="evenodd" />
                        </svg>
                        <span>{errorProf}</span>
                    </div>
                }
            </div>
        </article>
    </section>
 )
}