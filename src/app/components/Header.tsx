import { Button } from "./ui/button";
import logoPlacaMercosul from "figma:asset/57bdf21bb52564097625e6c71a1731475661ae9e.png";
import { analytics } from "../utils/analytics";
import { useNavigate, useLocation, Link } from "react-router";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNav = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault();
    analytics.navClick(sectionId);
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        else window.scrollTo(0, 0);
      }, 100);
    } else {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToForm = () => {
    analytics.ctaClick('header');
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-[1440px] mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <img 
                src={logoPlacaMercosul} 
                alt="PlacaMercosul" 
                className="h-24 w-auto -my-3 hover:opacity-90 transition-opacity"
              />
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="/#inicio" onClick={(e) => handleNav(e, 'inicio')} className="text-gray-700 hover:text-blue-900 transition-colors">
              Início
            </a>
            <a href="/#como-funciona" onClick={(e) => handleNav(e, 'como-funciona')} className="text-gray-700 hover:text-blue-900 transition-colors">
              Como funciona
            </a>
            <a href="/#duvidas" onClick={(e) => handleNav(e, 'duvidas')} className="text-gray-700 hover:text-blue-900 transition-colors">
              Dúvidas
            </a>
            <a href="/#contato" onClick={(e) => handleNav(e, 'contato')} className="text-gray-700 hover:text-blue-900 transition-colors">
              Contato
            </a>
            <Button 
              onClick={scrollToForm}
              className="bg-blue-900 hover:bg-blue-800"
            >
              Emplacar meu veículo
            </Button>
          </nav>

          <Button 
            onClick={scrollToForm}
            className="md:hidden bg-blue-900 hover:bg-blue-800"
            size="sm"
          >
            Emplacar
          </Button>
        </div>
      </div>
    </header>
  );
}