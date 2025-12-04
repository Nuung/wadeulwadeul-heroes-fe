import { USER_STORAGE_KEY } from "@/shared/api";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hasUser =
      typeof window !== "undefined" &&
      Boolean(localStorage.getItem(USER_STORAGE_KEY));
    if (!hasUser && location.pathname !== "/") {
      navigate("/", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <main className="flex-grow flex flex-col items-center justify-start py-6 w-full max-w-6xl">
        <Outlet />
      </main>
    </div>
  );
}
