import { createContext, useContext, useState } from "react";

const LoaderContext = createContext<any>(null);

export function LoaderProvider({ children }: { children: any }) {
    const [loading, setLoading] = useState(false);

    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    return (
        <LoaderContext.Provider value={{ loading, showLoader, hideLoader }}>
            {children}
            {loading && (
                <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
                    <div className="animate-spin border-4 border-white border-t-transparent rounded-full w-12 h-12"></div>
                </div>
            )}
        </LoaderContext.Provider>
    );
}

export const useLoader = () => useContext(LoaderContext);
