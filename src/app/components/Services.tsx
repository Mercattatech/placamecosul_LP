import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Car, RefreshCw, MapPinned, FileCheck, Truck, Bike } from "lucide-react";

export function Services() {
  const services = [
    {
      icon: Car,
      title: "Primeiro emplacamento de veículo 0km",
      description: "Emplacamento para veículos novos, saídos diretamente da concessionária."
    },
    {
      icon: RefreshCw,
      title: "Troca para placa Mercosul",
      description: "Atualize seu veículo para o padrão de placa Mercosul."
    },
    {
      icon: MapPinned,
      title: "Transferência de município em SP",
      description: "Transfira o emplacamento do seu veículo entre cidades paulistas."
    },
    {
      icon: FileCheck,
      title: "Segunda via e regularização",
      description: "Obtenha segunda via de placas ou regularize pendências."
    },
    {
      icon: Truck,
      title: "Emplacamento de utilitários",
      description: "Serviço especializado para caminhões e veículos comerciais."
    },
    {
      icon: Bike,
      title: "Emplacamento de motocicletas",
      description: "Emplacamento rápido e prático para motos de todas as cilindradas."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-6">
        <h2 className="text-center text-blue-900 mb-4">
          O que você pode resolver aqui
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Conectamos você com empresas especializadas em diversos tipos de serviços de emplacamento
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-blue-900" />
                </div>
                <h3 className="text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {service.description}
                </p>
              </Card>
            );
          })}
        </div>

        <div className="text-center">
          <Button 
            size="lg"
            className="bg-blue-900 hover:bg-blue-800"
            onClick={() => document.getElementById('formulario')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Quero emplacar meu veículo
          </Button>
        </div>
      </div>
    </section>
  );
}
