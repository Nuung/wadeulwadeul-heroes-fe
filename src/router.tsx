import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home";
import Form from "./pages/Form";
import Map from "./pages/Map";
import ExperienceForm from "./pages/ExperienceForm";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "form", element: <Form /> },
      { path: "map", element: <Map /> },
      { path: "experience/new", element: <ExperienceForm /> },
    ],
  },
]);
