import { useEffect } from "react";
import { Link } from "react-router";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import logoPlacaMercosul from "figma:asset/57bdf21bb52564097625e6c71a1731475661ae9e.png";

export function ThankYou() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Solicitação Recebida | PlacaMercosul';
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      {/* Conteúdo Principal */}
      <main className="flex-1 pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-6">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <Link to="/">
                <img 
                  src={logoPlacaMercosul} 
                  alt="PlacaMercosul" 
                  className="h-32 w-auto hover:opacity-90 transition-opacity"
                />
              </Link>
            </div>
            
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>
            
            <h1 className="text-green-600 mb-3">
              Solicitação Recebida com Sucesso!
            </h1>
            
            <p className="text-gray-700 text-lg">
              Obrigado por confiar na <strong>PlacaMercosul</strong>!
            </p>
          </div>

          {/* Card de Próximos Passos */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h2 className="text-blue-900 mb-4">
              📋 Próximos Passos
            </h2>
            <ol className="space-y-3 text-gray-700">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">1</span>
                <span>Nossa equipe de especialistas irá analisar sua solicitação</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">2</span>
                <span>Você receberá um contato em até <strong>24 horas úteis</strong></span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">3</span>
                <span>Apresentaremos as melhores opções e valores para seu emplacamento</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">4</span>
                <span>Após sua aprovação, iniciaremos o processo de emplacamento</span>
              </li>
            </ol>
          </div>

          {/* Avisos Importantes */}
          <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-6 mb-6">
            <div className="flex gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <h2 className="text-amber-900">
                ⚠️ Avisos Importantes
              </h2>
            </div>
            
            <ul className="space-y-3 text-gray-800">
              <li className="flex gap-2">
                <span className="text-amber-600">•</span>
                <span><strong>NÃO efetue nenhum tipo de pagamento</strong> antes de receber o contato oficial de nossos especialistas</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600">•</span>
                <span>Todos os contatos serão feitos pelos canais oficiais: <strong>telefone ou e-mail cadastrado</strong></span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600">•</span>
                <span>Desconfie de mensagens solicitando pagamentos antecipados ou através de canais não oficiais</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600">•</span>
                <span>A PlacaMercosul <strong>nunca solicita senhas bancárias</strong> ou dados sensíveis por mensagem</span>
              </li>
              <li className="flex gap-2">
                <span className="text-amber-600">•</span>
                <span>Guarde bem este lembrete: <strong>aguarde nosso contato oficial</strong> antes de qualquer ação</span>
              </li>
            </ul>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
