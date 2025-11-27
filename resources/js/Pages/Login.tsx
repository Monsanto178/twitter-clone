import { fetchData, getCsrfToken, getCookie } from "../Utils"
import { ReducedUserType } from '../Types'
import { UserCard } from "../Components"
import React, { useEffect, useState } from "react"
import cover from '../../assets/cover.jpg';

export default function Login() {
    const [profiles, setProfiles] = useState<Array<ReducedUserType> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const fetchProfiles = async() => {
        try {
            const data = await fetchData<Array<ReducedUserType>>('/api/profiles', 'GET');     
            
            setProfiles(data);
        } catch {
            setError('Failed to load profiles. Please reload the page')
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
                {!loading && profiles && 
                    profiles.map((profile, idx) => {
                        return (
                            <React.Fragment key={idx}>
                                <UserCard profile={profile}/>
                            </React.Fragment>
                        )
                    })
                }
            </div>
        </article>
    </section>
 )
}