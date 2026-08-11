import { createBrowserRouter } from "react-router";
import { Home } from "../pages/Home";
import { ThankYou } from "../pages/ThankYou";
import { AdminGallery } from "../pages/AdminGallery";
import { AdminAnalytics } from "../pages/AdminAnalytics";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/obrigado",
    Component: ThankYou,
  },
  {
    path: "/obrigado/",
    Component: ThankYou,
  },
  {
    path: "/obrigado2",
    Component: ThankYou,
  },
  {
    path: "/obrigado2.html",
    Component: ThankYou,
  },
  {
    path: "/admin-galeria",
    Component: AdminGallery,
  },
  {
    path: "/admin/analytics",
    Component: AdminAnalytics,
  },
  {
    path: "*",
    Component: Home,
  },
]);
