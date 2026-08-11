import { Car, Mail, Phone, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer id="contato" className="bg-blue-950 text-white">
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-12 mb-8">
          {/* Coluna 1 - Sobre */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center">
                <Car className="w-6 h-6 text-gray-900" />
              </div>
              <span className="text-white">Portal Emplaca Brasil</span>
            </div>
            <p className="text-blue-200 text-sm">
              Portal privado de intermediação de serviços de emplacamento veicular em todo o Brasil. Conectamos motoristas com empresas especializadas e verificadas.
            </p>
          </div>

          {/* Coluna 2 - Links úteis */}
          <div>
            <h4 className="text-white mb-4">Links úteis</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/#inicio" className="text-blue-200 hover:text-white transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="/#como-funciona" className="text-blue-200 hover:text-white transition-colors">
                  Como funciona
                </a>
              </li>
              <li>
                <a href="/#duvidas" className="text-blue-200 hover:text-white transition-colors">
                  Dúvidas
                </a>
              </li>
              <li>
                <a href="/#contato" className="text-blue-200 hover:text-white transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Política de privacidade
                </a>
              </li>
              <li>
                <a href="#" className="text-blue-200 hover:text-white transition-colors">
                  Termos de uso
                </a>
              </li>
              <li className="pt-2 border-t border-blue-800">
                <a href="/#parceiros" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                  É empresa de emplacamento? Clique aqui
                </a>
              </li>
            </ul>
          </div>

          {/* Coluna 3 - Contato */}
          <div>
            <h4 className="text-white mb-4">Atendimento</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-200">WhatsApp</p>
                  <a href="#" className="text-white hover:text-yellow-400 transition-colors">
                    (11) 99999-9999
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-200">E-mail</p>
                  <a href="mailto:contato@placamercosul.com.br" className="text-white hover:text-yellow-400 transition-colors">
                    contato@placamercosul.com.br
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-200">Cobertura</p>
                  <p className="text-white">Todo o Brasil</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-blue-800 pt-8">
          <p className="text-center text-blue-300 text-sm">
            © {new Date().getFullYear()} Portal Emplaca Brasil. Todos os direitos reservados.
          </p>
          <p className="text-center text-blue-400 text-xs mt-2">
            <a href="/admin-galeria" className="hover:text-blue-200 transition-colors opacity-50 hover:opacity-100">
              Área administrativa
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}