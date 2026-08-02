import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Shield, CheckCircle, MapPin, Clock, Users, Star, ArrowRight, Zap } from "lucide-react";
import { CitySearch } from "./CitySearch";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { useNavigate } from "react-router";
import placaMercosul from 'figma:asset/eb21452ab613631b27c068573972131f148a38df.png';
import { AnimatedBackground } from "./AnimatedBackground";
import { motion } from "motion/react";
import { analytics } from "../utils/analytics";

export function Hero() {
  const navigate = useNavigate();
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
      // 3. Evento: form_start
      analytics.formStart('hero');
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
    // 4. Evento: form_submit
    analytics.formSubmit('hero', { tipoVeiculo, marcaVeiculo });

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      nome: formData.get('nome'),
      whatsapp: formData.get('whatsapp'),
      email: formData.get('email'),
      estado: selectedState,
      cidade: selectedCity,
      tipoVeiculo: tipoVeiculo,
      marcaVeiculo: marcaVeiculo,
      modeloVeiculo: formData.get('modelo-veiculo'),
      anoVeiculo: formData.get('ano-veiculo'),
      origem: 'Formulário Hero - Landing Page',
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
        // 5. Evento: form_success
        analytics.formSuccess('hero');
        navigate('/obrigado');
      } else {
        // 6. Evento: form_error
        analytics.formError('hero', `HTTP ${response.status}`);
        alert("Erro ao enviar formulário. Por favor, tente novamente.");
      }
    } catch (error) {
      console.error('Erro ao enviar formulário:', error);
      // 6. Evento: form_error
      analytics.formError('hero', String(error));
      alert("Erro ao enviar formulário. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      id="inicio"
      className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 pt-20 pb-16 relative overflow-hidden"
    >
      {/* Gradient overlay para garantir legibilidade */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/98 to-blue-800/98" />
      
      {/* Background animado */}
      <AnimatedBackground />
      
      <div className="max-w-[1440px] mx-auto px-6 relative z-10">
        {/* Badge de destaque no topo */}
        <motion.div
          className="flex justify-center mb-8 pt-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-full inline-flex items-center gap-2 shadow-xl">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-bold">+10.325 emplacamentos realizados em 2025</span>
            <Star className="w-5 h-5 fill-current" />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Lado esquerdo - Conteúdo */}
          <motion.div 
            className="text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Headline super chamativa */}
            <motion.h1 
              className="text-white mb-6 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Emplacamento
              <span className="block text-yellow-400 mt-2">Rápido e Simples</span>
              <span className="block text-4xl md:text-5xl lg:text-6xl mt-3 text-blue-200">
                em Todo o Brasil
              </span>
            </motion.h1>
            
            {/* Subheadline com benefício claro */}
            <motion.p 
              className="text-blue-100 mb-8 text-xl md:text-2xl font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Receba até <span className="text-yellow-400 font-bold">3 orçamentos</span> de empresas confiáveis em <span className="text-yellow-400 font-bold">até 24 horas</span>
            </motion.p>

            {/* Imagem da placa Mercosul */}
            <motion.div 
              className="mb-8 flex justify-center md:justify-start"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <img 
                src={placaMercosul} 
                alt="Placa Mercosul Brasil" 
                className="w-full max-w-[380px] h-auto drop-shadow-2xl"
              />
            </motion.div>

            {/* Cards de benefícios */}
            <motion.div
              className="grid grid-cols-2 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {[
                { icon: Zap, title: "Atendimento Rápido", desc: "Resposta em 24h" },
                { icon: Shield, title: "100% Seguro", desc: "Dados protegidos" },
                { icon: CheckCircle, title: "Sem Burocracia", desc: "Processo simplificado" },
                { icon: Users, title: "Parceiros Verificados", desc: "Empresas confiáveis" }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + (index * 0.1) }}
                    whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 255, 255, 0.15)" }}
                  >
                    <Icon className="w-8 h-8 text-yellow-400 mb-2" />
                    <h4 className="font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-blue-200 text-sm">{item.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA secundário */}
            <motion.div
              className="bg-yellow-500/10 border-2 border-yellow-500 rounded-xl p-6 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              <p className="text-yellow-400 font-bold mb-2 text-lg">🎯 Processo 100% Online</p>
              <p className="text-white text-sm">
                Preencha o formulário agora e receba contato de empresas especializadas na sua região. Compare preços e escolha a melhor opção!
              </p>
            </motion.div>
          </motion.div>

          {/* Lado direito - Card de formulário MELHORADO */}
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl p-8 border-4 border-yellow-400 relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            whileHover={{ scale: 1.01, boxShadow: "0 30px 60px -12px rgba(0, 0, 0, 0.3)" }}
          >
            {/* Badge "Formulário Rápido" */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-gray-900 px-6 py-2 rounded-full font-bold shadow-lg">
              ⚡ Formulário Rápido - 2 minutos
            </div>

            <div className="text-center mb-6 mt-4">
              <h3 className="text-gray-900 mb-2 text-2xl md:text-3xl">
                Solicite Seu Emplacamento
              </h3>
              <p className="text-gray-600">
                Receba até 3 orçamentos grátis
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit} onFocus={handleFirstInteraction}>
              <div>
                <Label htmlFor="nome">Nome completo</Label>
                <Input id="nome" name="nome" placeholder="Digite seu nome" className="mt-1" required />
              </div>
              
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input id="whatsapp" name="whatsapp" placeholder="(11) 99999-9999" className="mt-1" required />
              </div>
              
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" name="email" type="email" placeholder="seu@email.com" className="mt-1" required />
              </div>
              
              <CitySearch 
                namePrefix="hero-" 
                onValidationChange={setIsCityValid}
                onStateChange={setSelectedState}
                onCityChange={setSelectedCity}
              />
              
              <div>
                <Label htmlFor="tipo-veiculo">Tipo de veículo</Label>
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
                <Label htmlFor="marca-veiculo">Marca do veículo</Label>
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
                <Label htmlFor="modelo-veiculo">Modelo do veículo</Label>
                <Input 
                  id="modelo-veiculo"
                  name="modelo-veiculo"
                  placeholder="Ex: Onix, Gol, Civic, CB 500..." 
                  className="mt-1" 
                  required 
                />
              </div>

              <div>
                <Label htmlFor="ano-veiculo">Ano do veículo</Label>
                <Input 
                  id="ano-veiculo"
                  name="ano-veiculo"
                  type="number" 
                  placeholder="Ex: 2024" 
                  className="mt-1" 
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  required 
                />
              </div>

              <div className="flex items-start gap-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
                <Checkbox 
                  id="hero-lgpd" 
                  checked={lgpdChecked}
                  onCheckedChange={(checked) => setLgpdChecked(checked as boolean)}
                />
                <Label htmlFor="hero-lgpd" className="text-sm cursor-pointer leading-relaxed">
                  Autorizo o uso dos meus dados para contato sobre emplacamento. Seus dados serão tratados conforme a LGPD e compartilhados apenas com empresas parceiras qualificadas.
                </Label>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-900 hover:bg-blue-800 text-lg py-6 font-bold" 
                size="lg" 
                disabled={isSubmitting}
                onClick={handleFirstInteraction}
              >
                {isSubmitting ? "Enviando..." : "Receber Orçamentos Grátis"}
                {!isSubmitting && <ArrowRight className="ml-2 w-5 h-5" />}
              </Button>

              <p className="text-center text-sm text-gray-500">
                🔒 Seus dados estão seguros e protegidos
              </p>
            </form>
          </motion.div>
        </div>

        {/* Faixa de confiança MELHORADA */}
        <motion.div 
          className="mt-12 bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <p className="text-white text-center mb-6 text-xl font-bold">
            ✨ Por que escolher o PlacaMercosul?
          </p>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Shield, text: "Site 100% Seguro", subtitle: "Certificado SSL" },
              { icon: Users, text: "Parceiros Verificados", subtitle: "Empresas confiáveis" },
              { icon: MapPin, text: "Cobertura Nacional", subtitle: "Todo o Brasil" },
              { icon: Clock, text: "Resposta Rápida", subtitle: "Até 24 horas" }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={index}
                  className="flex flex-col items-center gap-2 text-white text-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.4 + (index * 0.1) }}
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <div className="bg-yellow-500 p-3 rounded-full">
                    <Icon className="w-6 h-6 text-gray-900" />
                  </div>
                  <span className="font-bold">{item.text}</span>
                  <span className="text-sm text-blue-200">{item.subtitle}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}