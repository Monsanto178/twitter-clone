import { createContext, ReactNode, useContext, useState } from "react"

interface ErrorContextType {
    error: string | null;
    setErrorState: (value: string) => void;
    clearError: () => void;
}

interface ProviderProps {
    children: ReactNode;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const ErrorProvider = ({children}:ProviderProps) => {
    const [error, setError] = useState<string | null>(null);

    const clearError = () => {
        setError(null);
    }
    const setErrorState = (value:string) => {
        setError(value);
    }

    return (
        <ErrorContext.Provider value={{error, clearError, setErrorState}}>
            {children}
        </ErrorContext.Provider>
    )
}

export const useErrorContext = (): ErrorContextType => {
    const context = useContext(ErrorContext);
    if(!context) {
        throw new Error("useContext must be used inside a provider");
    }
    return context;
}