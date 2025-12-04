import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import "./index.css";
import { USER_STORAGE_KEY, baseClient } from "./shared/api";
import { ToastProvider } from "./shared/hook/ToastProvider";

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
    const userId =
      typeof window !== "undefined"
        ? localStorage.getItem(USER_STORAGE_KEY) ?? undefined
        : undefined;

    // 브라우저 기본 정보 (fallback)
    config.headers.set(
      "X-Browser-Timezone",
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    config.headers.set(
      "X-Browser-Country",
      Intl.DateTimeFormat().resolvedOptions().locale?.split("-")[1] || "KR"
    );

    if (userId) {
      config.headers.set("wadeulwadeul-user", userId);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

createRoot(document.getElementById("root")!).render(
  <ToastProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </ToastProvider>
);
