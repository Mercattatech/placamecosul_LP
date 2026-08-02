import { createBrowserRouter } from "react-router";
import { Home } from "../pages/Home";
import { ThankYou } from "../pages/ThankYou";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/obrigado",
    Component: ThankYou,
  },
]);
