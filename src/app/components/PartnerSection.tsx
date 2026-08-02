import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Briefcase } from "lucide-react";

export function PartnerSection() {
  return (
    <section className="py-16 bg-gray-50 border-t border-gray-200">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Briefcase className="w-6 h-6 text-blue-900" />
            <h3 className="text-blue-900 text-center">
              Você é empresa de emplacamento no Brasil?
            </h3>
          </div>
          
          <p className="text-center text-gray-700 mb-8">
            Se sua empresa faz emplacamento, estampagem de placas ou é despachante, podemos indicar clientes da sua região.
          </p>

          <Card className="p-8 bg-white">
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Nosso portal recebe diariamente pedidos de motoristas que querem emplacar veículos em várias cidades do Brasil.
              </p>
              <p className="text-gray-700">
                Se você é do setor e quer receber esses contatos, preencha seus dados que nossa equipe entra em contato para explicar como funciona.
              </p>
            </div>

            <form className="space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="empresa-nome">Nome da empresa *</Label>
                  <Input id="empresa-nome" placeholder="Razão social ou nome fantasia" className="mt-1" />
                </div>
                
                <div>
                  <Label htmlFor="empresa-responsavel">Nome do responsável *</Label>
                  <Input id="empresa-responsavel" placeholder="Seu nome" className="mt-1" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="empresa-whatsapp">WhatsApp comercial *</Label>
                  <Input id="empresa-whatsapp" placeholder="(11) 99999-9999" className="mt-1" />
                </div>
                
                <div>
                  <Label htmlFor="empresa-cidades">Cidade(s) de atendimento *</Label>
                  <Input id="empresa-cidades" placeholder="Ex: São Paulo, Guarulhos" className="mt-1" />
                </div>
              </div>

              <div>
                <Label htmlFor="empresa-tipo">Tipo de serviço oferecido *</Label>
                <Input id="empresa-tipo" placeholder="Ex: Emplacamento, Estampadora, Despachante" className="mt-1" />
              </div>

              <div>
                <Label htmlFor="empresa-volume">Quantos emplacamentos você faz por mês, em média?</Label>
                <Textarea 
                  id="empresa-volume" 
                  placeholder="Conte um pouco sobre o volume de atendimento da sua empresa"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <Button className="w-full bg-blue-900 hover:bg-blue-800">
                Quero receber mais informações
              </Button>

              <p className="text-center text-gray-600 text-sm">
                Nossa equipe comercial entrará em contato em até 48 horas úteis
              </p>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}