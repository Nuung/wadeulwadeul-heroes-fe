import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import { baseClient } from "./shared/api";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5분
    },
  },
});

baseClient.interceptors.request.use(
  async (config) => {
    const { session } = {
      session: { userId: "550e8400-e29b-41d4-a716-446655440001" },
    }; //useSessionStore.getState();

    // 브라우저 기본 정보 (fallback)
    config.headers.set(
      "X-Browser-Timezone",
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    config.headers.set(
      "X-Browser-Country",
      Intl.DateTimeFormat().resolvedOptions().locale?.split("-")[1] || "KR"
    );

    if (session) {
      config.headers.set("wadeulwadeul-user", session.userId);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
