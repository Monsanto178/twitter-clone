import { ErrorBox, SideMenu } from "@/Components";
import { ReactNode } from "react"
import { usePage } from "@inertiajs/react";
import { ReplyProvider } from "@/Context/ReplyContext";
import { ProfileProvider } from "@/Context/ProfileContext";
import { ErrorProvider } from "@/Context/ErrorContext";
import Login from "@/Pages/Login";


type Props = {
    children: ReactNode;
}

export default function Layout({children}:Props) {
    const component = usePage();
    const title = component.component;
    return (
        <>
        {title !== 'Login' && 
        <ProfileProvider>
            <ReplyProvider>
                <ErrorProvider>
                    <main className="relative bg-[#09122C] text-white h-full w-full flex justify-center px-2 mx-auto py-4 min-h-[100dvh]">
                        <SideMenu currentSelect={title}/>
                        <section className="flex flex-col min-w-[380px] max-w-[700px] w-full pb-36">
                            {children}
                        </section>
                        <ErrorBox/>
                    </main>
                </ErrorProvider>
            </ReplyProvider>
        </ProfileProvider>
        }
        {title === 'Login' &&
            <main className="relative bg-[#09122C] text-white h-full w-full flex justify-center px-2 mx-auto py-4 min-h-[100dvh]">
                <section className="flex flex-col justify-center min-w-[380px] max-w-[700px] w-full pb-36">
                    <Login />
                </section>
            </main>
        }
        </>
    )
}