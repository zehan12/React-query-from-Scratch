import React from "react";
import { QueryClientContext } from "./QueryClientContext";
import { QueryClient } from "./QueryClient";

export const QueryClientProvider = ({
    client,
    children,
}: {
    client: QueryClient;
    children: React.ReactNode;
}) => {
    return (
        <QueryClientContext.Provider value={client}>
            {children}
        </QueryClientContext.Provider>
    );
};