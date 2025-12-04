import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <main className="flex-grow flex flex-col items-center justify-start py-6 w-full max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
}
