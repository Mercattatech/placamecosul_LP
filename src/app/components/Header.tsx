import { Button } from "./ui/button";
import logoPlacaMercosul from "figma:asset/57bdf21bb52564097625e6c71a1731475661ae9e.png";
import { analytics } from "../utils/analytics";

export function Header() {
  const scrollToForm = () => {
    // 2. Evento: cta_click — botão do header
    analytics.ctaClick('header');
    document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavClick = (destination: string) => {
    // 12. Evento: nav_click — links de navegação
    analytics.navClick(destination);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-[1440px] mx-auto px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img 
              src={logoPlacaMercosul} 
              alt="PlacaMercosul" 
              className="h-24 w-auto -my-3"
            />
          </div>
          
          <nav className="hidden md:flex items-center gap-8">
            <a href="#inicio" onClick={() => handleNavClick('inicio')} className="text-gray-700 hover:text-blue-900 transition-colors">
              Início
            </a>
            <a href="#como-funciona" onClick={() => handleNavClick('como-funciona')} className="text-gray-700 hover:text-blue-900 transition-colors">
              Como funciona
            </a>
            <a href="#duvidas" onClick={() => handleNavClick('duvidas')} className="text-gray-700 hover:text-blue-900 transition-colors">
              Dúvidas
            </a>
            <a href="#contato" onClick={() => handleNavClick('contato')} className="text-gray-700 hover:text-blue-900 transition-colors">
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