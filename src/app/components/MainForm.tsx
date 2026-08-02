import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card } from "./ui/card";
import { CitySearch } from "./CitySearch";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { CheckCircle2, AlertTriangle, Phone, Mail } from "lucide-react";
import { analytics } from "../utils/analytics";

export function MainForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isCityValid, setIsCityValid] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [lgpdChecked, setLgpdChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tipoVeiculo, setTipoVeiculo] = useState("");
  const [marcaVeiculo, setMarcaVeiculo] = useState("");
  const [formStarted, setFormStarted] = useState(false);

  const handleFirstInteraction = () => {
    if (!formStarted) {
      setFormStarted(true);
      analytics.formStart('main');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedState) {
      alert("Por favor, selecione um estado");
      return;
    }
    
    if (!selectedCity || !selectedCity.trim()) {
      alert("Por favor, digite o nome da sua cidade");
      return;
    }
    
    if (!lgpdChecked) {
      alert("Por favor, aceite os termos de uso de dados");
      return;
    }

    setIsSubmitting(true);
    analytics.formSubmit('main', { tipoVeiculo, marcaVeiculo });

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      nome: formData.get('form-nome'),
      whatsapp: formData.get('form-whatsapp'),
      email: formData.get('form-email'),
      estado: selectedState,
      cidade: selectedCity,
      tipoVeiculo: tipoVeiculo,
      marcaVeiculo: marcaVeiculo,
      modeloVeiculo: formData.get('form-modelo-veiculo'),
      anoVeiculo: formData.get('form-ano-veiculo'),
      origem: 'Formulário Principal - Landing Page',
      dataHora: new Date().toISOString()
    };

    try {
      const response = await fetch('https://n8nwebhook.mercattatech.com.br/webhook/lp-placamercosul-online', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        analytics.formSuccess('main');
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        analytics.formError('main', `HTTP ${response.status}`);
        alert("Erro ao enviar formulário. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      analytics.formError('main', String(error));
      alert("Erro ao enviar formulário. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="formulario" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-lg p-10 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <h2 className="text-green-600 mb-3 font-bold">Solicitação Recebida com Sucesso!</h2>
            <p className="text-gray-700 text-lg mb-8">Obrigado por confiar na <strong>PlacaMercosul</strong>!</p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6 text-left">
              <h3 className="text-blue-900 font-bold mb-4">📋 Próximos Passos</h3>
              <ol className="space-y-3 text-gray-700">
                {["Nossa equipe irá analisar sua solicitação", "Você receberá um contato em até 24 horas úteis", "Apresentaremos as melhores opções e valores", "Após sua aprovação, iniciaremos o emplacamento"].map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm">{i + 1}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-5 mb-6 text-left">
              <div className="flex gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <span className="text-amber-900 font-bold text-sm">⚠️ Aviso Importante</span>
              </div>
              <p className="text-gray-800 text-sm"><strong>NÃO efetue nenhum pagamento</strong> antes de receber o contato oficial de nossos especialistas.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="text-xs text-gray-600">WhatsApp</p>
                  <p className="text-gray-900 font-medium">(11) 99999-9999</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-blue-600" />
                <div className="text-left">
                  <p className="text-xs text-gray-600">E-mail</p>
                  <p className="text-gray-900 font-medium">contato@placamercosul.com.br</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="formulario" className="py-20 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-center text-blue-900 mb-4">
            Preencha seus dados e receba contato em poucos minutos
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Empresas parceiras verificadas entrarão em contato para atender sua solicitação
          </p>

          <Card className="p-8">
            <form className="space-y-6" onSubmit={handleSubmit} onFocus={handleFirstInteraction}>
              <div>
                <Label htmlFor="form-nome">Nome completo</Label>
                <Input id="form-nome" name="form-nome" placeholder="Digite seu nome" className="mt-1" required />
              </div>
              
              <div>
                <Label htmlFor="form-whatsapp">WhatsApp</Label>
                <Input id="form-whatsapp" name="form-whatsapp" placeholder="(11) 99999-9999" className="mt-1" required />
              </div>

              <div>
                <Label htmlFor="form-email">E-mail</Label>
                <Input id="form-email" name="form-email" type="email" placeholder="seu@email.com" className="mt-1" required />
              </div>

              <CitySearch 
                namePrefix="form-" 
                onValidationChange={setIsCityValid}
                onStateChange={setSelectedState}
                onCityChange={setSelectedCity}
              />

              <div>
                <Label htmlFor="form-tipo-veiculo">Tipo de veículo</Label>
                <Select required value={tipoVeiculo} onValueChange={setTipoVeiculo}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="carro">Carro</SelectItem>
                    <SelectItem value="moto">Moto</SelectItem>
                    <SelectItem value="caminhao">Caminhão</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="form-marca-veiculo">Marca do veículo</Label>
                <Select required value={marcaVeiculo} onValueChange={setMarcaVeiculo}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Selecione a marca" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="chevrolet">Chevrolet</SelectItem>
                    <SelectItem value="volkswagen">Volkswagen</SelectItem>
                    <SelectItem value="fiat">Fiat</SelectItem>
                    <SelectItem value="ford">Ford</SelectItem>
                    <SelectItem value="hyundai">Hyundai</SelectItem>
                    <SelectItem value="toyota">Toyota</SelectItem>
                    <SelectItem value="renault">Renault</SelectItem>
                    <SelectItem value="honda">Honda</SelectItem>
                    <SelectItem value="nissan">Nissan</SelectItem>
                    <SelectItem value="jeep">Jeep</SelectItem>
                    <SelectItem value="peugeot">Peugeot</SelectItem>
                    <SelectItem value="citroen">Citroën</SelectItem>
                    <SelectItem value="mitsubishi">Mitsubishi</SelectItem>
                    <SelectItem value="bmw">BMW</SelectItem>
                    <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                    <SelectItem value="audi">Audi</SelectItem>
                    <SelectItem value="volvo">Volvo</SelectItem>
                    <SelectItem value="caoa-chery">Caoa Chery</SelectItem>
                    <SelectItem value="byd">BYD</SelectItem>
                    <SelectItem value="gwm">GWM</SelectItem>
                    <SelectItem value="yamaha">Yamaha (Motos)</SelectItem>
                    <SelectItem value="harley">Harley-Davidson (Motos)</SelectItem>
                    <SelectItem value="kawasaki">Kawasaki (Motos)</SelectItem>
                    <SelectItem value="suzuki">Suzuki (Motos)</SelectItem>
                    <SelectItem value="ducati">Ducati (Motos)</SelectItem>
                    <SelectItem value="outra">Outra marca</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="form-modelo-veiculo">Modelo do veículo</Label>
                <Input 
                  id="form-modelo-veiculo"
                  name="form-modelo-veiculo"
                  placeholder="Ex: Onix, Gol, Civic, CB 500..." 
                  className="mt-1" 
                  required 
                />
              </div>

              <div>
                <Label htmlFor="form-ano-veiculo">Ano do veículo</Label>
                <Input 
                  id="form-ano-veiculo"
                  name="form-ano-veiculo"
                  type="number" 
                  placeholder="Ex: 2024" 
                  className="mt-1" 
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required 
                />
              </div>

              <div className="flex items-start gap-3 bg-blue-50 p-4 rounded">
                <Checkbox 
                  id="form-lgpd" 
                  checked={lgpdChecked}
                  onCheckedChange={(checked) => setLgpdChecked(checked as boolean)}
                />
                <Label htmlFor="form-lgpd" className="text-sm cursor-pointer">
                  Autorizo o uso dos meus dados para contato sobre emplacamento. Seus dados serão tratados conforme a LGPD e compartilhados apenas com empresas parceiras qualificadas.
                </Label>
              </div>

              <Button type="submit" className="w-full bg-blue-900 hover:bg-blue-800" size="lg" disabled={isSubmitting}>
                Enviar pedido de emplacamento
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}