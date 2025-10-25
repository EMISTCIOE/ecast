import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import type { AppProps } from "next/app";
import { PopupManager } from "@/components/PopupManager";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes (formerly cacheTime)
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
      <PopupManager />
    </QueryClientProvider>
  );
}
