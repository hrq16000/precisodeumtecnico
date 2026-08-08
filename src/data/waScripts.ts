/**
 * Fonte única das mensagens operacionais prontas (copiar e colar) usadas pela
 * central antes de abrir a triagem. Nada aqui promete prazo/valor além do que
 * já está em `pricingPolicy` — os textos apenas pedem as informações mínimas.
 */
import { PRICING, SLA } from "@/data/pricingPolicy";

export interface WaScript {
  id: string;
  label: string;
  /** Intenção comercial resumida (aparece como subtítulo). */
  intent: string;
  /** Informações que o cliente precisa enviar antes da triagem. */
  asks: string[];
  message: string;
}

const CLOSING =
  `Assim que eu tiver esses dados eu abro a triagem e confirmo a modalidade (bancada a partir de ${PRICING.benchDiagnosis.priceLabel}, visita a partir de ${PRICING.technicalVisit.priceLabel} ou coleta ${PRICING.pickupDelivery.priceLabel}). ` +
  `Prazo mínimo de conclusão: ${SLA.minLabel}. Orçamento sempre antes do reparo.`;

function build(lines: string[]): string {
  return [...lines, "", CLOSING].join("\n");
}

export const WA_SCRIPTS: WaScript[] = [
  {
    id: "virus",
    label: "Vírus e lentidão",
    intent: "Remoção de vírus, malware e limpeza de sistema",
    asks: ["Marca/modelo", "Sistema (Windows 10/11)", "Prints do erro", "Se liga normalmente"],
    message: build([
      "Olá! Aqui é da Preciso de Um Técnico.",
      "Para avaliar o caso de vírus/lentidão, me envie por favor:",
      "1) Marca e modelo do equipamento",
      "2) Sistema instalado (Windows 10, 11 ou outro)",
      "3) O que aparece na tela (print ou foto)",
      "4) Se o equipamento liga e chega na área de trabalho",
      "5) Cidade e bairro",
    ]),
  },
  {
    id: "formatacao",
    label: "Formatação e backup",
    intent: "Formatação com preservação de dados",
    asks: ["Marca/modelo", "Tem backup?", "Arquivos a preservar", "Senha de acesso"],
    message: build([
      "Olá! Aqui é da Preciso de Um Técnico.",
      "Para a formatação, preciso confirmar antes:",
      "1) Marca e modelo do equipamento",
      "2) Você já tem backup dos arquivos?",
      "3) O que precisa ser preservado (documentos, fotos, e-mails, sistemas)",
      "4) Se existe senha de acesso ao sistema",
      "5) Cidade e bairro",
    ]),
  },
  {
    id: "upgrade",
    label: "SSD e memória",
    intent: "Upgrade de armazenamento e RAM",
    asks: ["Marca/modelo exato", "Foto da etiqueta", "Uso pretendido", "Peça própria?"],
    message: build([
      "Olá! Aqui é da Preciso de Um Técnico.",
      "Para o upgrade de SSD/memória, me envie:",
      "1) Marca e modelo exato (foto da etiqueta inferior ajuda)",
      "2) Capacidade atual de disco e memória, se souber",
      "3) Para que você usa o equipamento (trabalho, estudo, jogos)",
      "4) Se a peça será fornecida por você ou por nós",
      "5) Cidade e bairro",
    ]),
  },
  {
    id: "wifi",
    label: "Wi-Fi e rede",
    intent: "Instalação, cobertura e estabilidade de rede",
    asks: ["Provedor e plano", "Metragem/andares", "Modelo do roteador", "Pontos sem sinal"],
    message: build([
      "Olá! Aqui é da Preciso de Um Técnico.",
      "Para avaliar a rede/Wi-Fi, preciso de:",
      "1) Provedor e velocidade contratada",
      "2) Metragem aproximada e quantidade de andares/cômodos",
      "3) Marca e modelo do roteador atual (foto da etiqueta)",
      "4) Em quais pontos o sinal cai ou não chega",
      "5) Cidade e bairro",
    ]),
  },
  {
    id: "empresarial",
    label: "Suporte empresarial",
    intent: "Atendimento para empresas e escritórios",
    asks: ["Razão social/CNPJ", "Nº de estações", "Servidor/NAS?", "Janela de atendimento"],
    message: build([
      "Olá! Aqui é da Preciso de Um Técnico — atendimento empresarial.",
      "Para montar o escopo, me envie:",
      "1) Razão social e CNPJ",
      "2) Quantidade de estações e usuários",
      "3) Se existe servidor, NAS, CFTV ou sistema crítico envolvido",
      "4) Janela de atendimento preferida (horário comercial ou fora dele)",
      "5) Endereço com cidade e bairro",
    ]),
  },
  {
    id: "urgencia",
    label: "Urgência",
    intent: "Caso parado / operação interrompida",
    asks: ["O que parou", "Desde quando", "Impacto", "Endereço"],
    message: build([
      "Olá! Aqui é da Preciso de Um Técnico.",
      "Para tratar como urgência, confirme:",
      "1) O que exatamente parou de funcionar",
      "2) Desde quando está assim e o que mudou antes da falha",
      "3) Qual o impacto agora (trabalho parado, sem internet, sem acesso a dados)",
      "4) Endereço completo com cidade e bairro",
      "5) Fotos ou vídeo curto mostrando o problema",
    ]),
  },
];
