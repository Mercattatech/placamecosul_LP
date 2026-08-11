import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThankYou } from "./app/pages/ThankYou";
import { BrowserRouter } from "react-router";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ThankYou />
    </BrowserRouter>
  </StrictMode>
);
