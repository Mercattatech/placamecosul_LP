import { Card } from "./ui/card";
import { FileText, MapPin, Phone } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      icon: FileText,
      title: "Você preenche seus dados",
      description: "Informe suas informações e a cidade onde deseja realizar o emplacamento."
    },
    {
      icon: MapPin,
      title: "Encontramos empresas na sua região",
      description: "Nosso sistema identifica parceiros qualificados que atendem sua localidade."
    },
    {
      icon: Phone,
      title: "Receba contato rápido",
      description: "As empresas entrarão em contato para finalizar o emplacamento do seu veículo."
    }
  ];

  return (
    <section id="como-funciona" className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-6">
        <h2 className="text-center text-blue-900 mb-12">
          Como funciona o portal
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="p-8 text-center border-2 hover:border-blue-900 transition-colors">
                <div className="w-16 h-16 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-gray-900">{index + 1}</span>
                </div>
                <h3 className="text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
