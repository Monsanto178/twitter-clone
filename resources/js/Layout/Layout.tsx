import { SideMenu } from "../Components";
import { ReactNode } from "react"
import { usePage } from "@inertiajs/react";

type Props = {
    children: ReactNode;
}

export default function Layout({children}:Props) {
    const component = usePage();
    const title = component.component;
    return (
        <>
        <main className="bg-[#09122C] text-white h-full w-full flex justify-center px-2 mx-auto py-20 min-h-[100dvh]">
            <SideMenu currentSelect={title}/>
            <section className="flex flex-col min-w-[380px] max-w-[700px] w-full">
                {children}
            </section>
        </main>
        </>
    )
}