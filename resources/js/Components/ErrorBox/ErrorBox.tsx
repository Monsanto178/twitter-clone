import { useState } from "react";
import { useErrorContext } from "@/Context/ErrorContext"

export const ErrorBox = () => {
    const {error, clearError} = useErrorContext();
    const [show, setShow] = useState(true);

    const dimiss = () => {
        setShow(false);
        setTimeout(() => {
            clearError();
        }, 300);
    }
    return (
    <section className={`fixed bottom-0 w-full z-999999 transition-all duration-300 ease-in-out 
        bg-blue-500 w-[100dvw] 
        ${error 
            ? 'h-fit min-h-10' 
            : 'h-0 min-h-0'}
        ${show 
            ? 'opacity-100' 
            : 'opacity-0'}`}>
        {error && 
            <div
                onClick={() => {dimiss()}}
                className="flex flex-col flex justify-center
                cursor-pointer transition-scale transform-scale duration-300 ease-in-out hover:scale-102">
                {/* <div className="absolute inset-0 backdrop-blur-[4px] z-997"></div> */}
                <div className="flex wrap justify-center items-center z-999 text-[14px] pt-1 pl-2 pr-2 sm:text-[15px] md:text-[16px]">
                    <strong>{error}</strong>
                </div>
                <div className="z-999 flex justify-center items-center pb-1 opacity-75">
                    <span>{`(click to dismiss)`}</span>
                </div>
            </div>
        }
    </section>
    )
}