import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Main from "./pages/Main";
import { UserMain } from "./pages/user/UserMain";
import { CreatorMain } from "./pages/creator/CreatorMain";
import ExperienceForm from "./pages/ExperienceForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Main /> },
      { path: "creator", element: <CreatorMain /> },
      { path: "user", element: <UserMain /> },
      { path: "form", element: <ExperienceForm /> },
    ],
  },
]);
