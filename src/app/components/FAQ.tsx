import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { analytics } from "../utils/analytics";

export function FAQ() {
  const faqs = [
    {
      question: "Quanto tempo leva para emplacar o veículo?",
      answer: "O prazo varia conforme o tipo de serviço e a região. Em geral, o primeiro emplacamento pode levar de 3 a 10 dias úteis. A empresa parceira que entrar em contato informará o prazo específico para o seu caso."
    },
    {
      question: "Posso emplacar em qualquer cidade do Brasil?",
      answer: "Sim! Você pode escolher emplacar seu veículo em qualquer município do Brasil, desde que o veículo esteja regularizado. Nossa rede de parceiros atende diversas cidades em todo o país."
    },
    {
      question: "Preciso estar presente no dia do emplacamento?",
      answer: "Depende do tipo de serviço. Para alguns processos é necessária a presença do proprietário ou de um procurador. A empresa parceira vai orientar você sobre todos os documentos e procedimentos necessários."
    },
    {
      question: "Vocês mesmos fazem o emplacamento?",
      answer: "Não. Somos um portal de intermediação que conecta você com empresas especializadas em emplacamento, estampadoras de placas e despachantes verificados. São esses parceiros que realizam o serviço de emplacamento."
    },
    {
      question: "O serviço tem algum custo?",
      answer: "A conexão através do nosso portal é gratuita. O valor do emplacamento será informado diretamente pela empresa parceira, já incluindo todos os custos (placas, taxas do Detran, mão de obra, etc.)."
    },
    {
      question: "Quais documentos vou precisar?",
      answer: "Os documentos variam conforme o tipo de serviço, mas geralmente incluem: RG, CPF, comprovante de residência, nota fiscal do veículo (se 0km), documentos anteriores do veículo, entre outros. A empresa parceira fornecerá uma lista completa."
    },
    {
      question: "Meus dados estão seguros?",
      answer: "Sim. Tratamos seus dados conforme a Lei Geral de Proteção de Dados (LGPD). Suas informações são compartilhadas apenas com empresas parceiras verificadas e exclusivamente para fins de prestação do serviço de emplacamento."
    },
    {
      question: "E se eu não receber contato?",
      answer: "Nossos parceiros têm o compromisso de retornar em até 24 horas úteis. Caso não receba contato nesse prazo, você pode entrar em contato conosco através dos canais de atendimento disponíveis no rodapé do site."
    }
  ];

  return (
    <section id="duvidas" className="py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-6">
        <h2 className="text-center text-blue-900 mb-4">
          Dúvidas frequentes
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Respondemos as principais questões sobre emplacamento no Brasil
        </p>
        
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                <AccordionTrigger
                  className="text-left hover:no-underline"
                  onClick={() => analytics.faqClick(faq.question, index)}
                >
                  <span className="text-gray-900">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}