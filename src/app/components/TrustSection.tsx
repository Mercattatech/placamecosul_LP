import { Button } from "./ui/button";
import { Shield, Lock, Clock, Star } from "lucide-react";
import { motion } from "motion/react";
import { Card } from "./ui/card";

export function TrustSection() {
  const trustBadges = [
    {
      icon: Shield,
      title: "Parceiros avaliados",
      description: "Todas as empresas são verificadas antes de entrarem na rede"
    },
    {
      icon: Lock,
      title: "Seus dados protegidos (LGPD)",
      description: "Uso responsável das suas informações pessoais"
    },
    {
      icon: Clock,
      title: "Atendimento rápido",
      description: "Resposta em até 24 horas úteis"
    }
  ];

  const testimonials = [
    {
      name: "Carlos M.",
      city: "São Paulo",
      text: "Consegui emplacar minha moto em 2 dias. Muito prático!"
    },
    {
      name: "Ana Paula S.",
      city: "Campinas",
      text: "Não precisei ficar ligando para vários lugares. Recomendo!"
    },
    {
      name: "Roberto L.",
      city: "Santos",
      text: "Transferi meu carro de município sem complicação."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-6">
        <h2 className="text-center text-blue-900 mb-12">
          Mais segurança para quem precisa emplacar em SP
        </h2>
        
        {/* Trust badges */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <motion.div 
                key={index} 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <motion.div 
                  className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-900"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon className="w-10 h-10 text-blue-900" />
                </motion.div>
                <h3 className="text-gray-900 mb-2">
                  {badge.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {badge.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Testimonials */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-center text-gray-900 mb-8">
            O que dizem nossos usuários
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="p-6 bg-gray-50 h-full">
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <p className="text-gray-900">{testimonial.name}</p>
                      <p className="text-gray-600 text-sm">{testimonial.city}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}