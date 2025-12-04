// ToastProvider.tsx
import { SnackbarProvider } from "notistack";
import { ReactNode } from "react";

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  return (
    <SnackbarProvider
      maxSnack={3} // 동시에 보여줄 토스트 개수
      anchorOrigin={{
        vertical: "top", // 위치
        horizontal: "right",
      }}
      autoHideDuration={3000} // 자동 닫힘 시간
      variant="info" // 기본 스타일
    >
      {children}
    </SnackbarProvider>
  );
};
