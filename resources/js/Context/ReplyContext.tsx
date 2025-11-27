import { createContext, ReactNode, useContext, useState } from "react";

interface ReplyContextType {
  reloadReply: boolean;
  setReloadReply: React.Dispatch<React.SetStateAction<boolean>>;
}

export const replyContext = createContext<ReplyContextType | undefined>(undefined);

interface ProviderProps {
    children: ReactNode;
}

export const ReplyProvider = ({children}: ProviderProps) => {
    const [reloadReply, setReloadReply] = useState(false);

    return (
        <replyContext.Provider value={{ reloadReply, setReloadReply}}>
            {children}
        </replyContext.Provider>
    );
};

export const useReplyContext = (): ReplyContextType => {
    const context = useContext(replyContext);
    if(!context) {
        throw new Error("useReplyContext must be used inside ReplyProvider");
    }
    
    return context;
}