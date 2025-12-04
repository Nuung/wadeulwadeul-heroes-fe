import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Main from "./pages/Main";
import { CreatorMain } from "./pages/creator/CreatorMain";
import { UserMain } from "./pages/user/UserMain";
import { UserReservations } from "./pages/user/UserReservations";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Main /> },
      { path: "creator", element: <CreatorMain /> },
      { path: "user", element: <UserMain /> },
      { path: "user/reservations", element: <UserReservations /> },
    ],
  },
]);
