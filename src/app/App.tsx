import { RouterProvider } from "react-router";
import { router } from "./utils/routes";
import { useEffect } from "react";
import logoPlacaMercosul from "figma:asset/57bdf21bb52564097625e6c71a1731475661ae9e.png";

export default function App() {
  useEffect(() => {
    // Atualizar o favicon
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) {
      favicon.href = logoPlacaMercosul;
    } else {
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.href = logoPlacaMercosul;
      document.head.appendChild(newFavicon);
    }

    // Atualizar o título da página
    document.title = 'PlacaMercosul - Emplacamento de Veículos em Todo o Brasil';
  }, []);

  return <RouterProvider router={router} />;
}