import { useContext } from "react";
import { QueryClientContext } from "./QueryClientContext";

export const useQueryClient = () => {
    const context = useContext(QueryClientContext);
    if (!context) {
        throw new Error('useQueryClient must be used within a QueryClientProvider');
    }
    return context;
};
