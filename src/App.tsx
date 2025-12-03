import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* 이 Outlet 부분에 Home 또는 About 컴포넌트가 렌더링됩니다. */}
      <Outlet />
    </main>
  );
}
