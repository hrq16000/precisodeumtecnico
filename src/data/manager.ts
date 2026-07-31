/**
 * Gestor técnico responsável — fonte única.
 *
 * IMPORTANTE: `name` é publicado em JSON-LD (Person) e no site. Se quiser
 * exibir o nome civil do responsável, altere APENAS aqui — todo o site e os
 * schemas consomem este arquivo e permanecem consistentes.
 */
import { COMPANY } from "@/data/companyInfo";

export const MANAGER = {
  /** Nome exibido e publicado no schema Person. */
  name: "Gestor Técnico Responsável",
  jobTitle: "Gestor técnico e responsável operacional",
  worksFor: COMPANY.legalName,
  since: COMPANY.foundingYear, // 1998
  /** Bio curta (usada em blocos resumidos). */
  shortBio: `Responsável técnico do ${COMPANY.brand} desde ${COMPANY.foundingYear}, com ${COMPANY.experiencePhrase.toLowerCase()} em manutenção eletrônica, informática e infraestrutura.`,
  /** Bio longa (página dedicada). */
  bio: [
    `Atuando com manutenção eletrônica e informática desde ${COMPANY.foundingYear}, o gestor técnico responsável pelo ${COMPANY.brand} conduz pessoalmente o padrão de triagem, diagnóstico e orçamento aplicado em todos os atendimentos do portal.`,
    "A rotina inclui análise prévia do equipamento (bancada, visita ou coleta), definição da modalidade correta antes de qualquer deslocamento, e registro documentado das condições comerciais aceitas pelo cliente — o que elimina orçamento surpresa e retrabalho.",
    "A operação combina atendimento próprio em Curitiba e Região Metropolitana com uma rede de prestadores parceiros homologados no restante do Brasil, sempre sob o mesmo protocolo técnico e as mesmas regras de preço mínimo, prazo e garantia.",
  ],
  /** Áreas de atuação técnica. */
  expertise: [
    "Manutenção de notebooks, desktops e PC gamer",
    "Reparo de placas e eletrônica de TVs LED/QLED",
    "Redes, Wi-Fi corporativo e cabeamento estruturado",
    "CFTV, controle de acesso e monitoramento",
    "Elétrica predial de baixa tensão e infraestrutura",
    "Recuperação de dados e migração de sistemas",
  ],
  /** Certificações / qualificações declaradas. */
  credentials: [
    { name: "Técnico em Eletrônica", issuer: "Formação técnica profissionalizante" },
    { name: "Manutenção de Microcomputadores e Redes", issuer: "Qualificação profissional" },
    { name: "NR-10 — Segurança em Instalações Elétricas", issuer: "Treinamento normativo" },
    { name: "Infraestrutura de Cabeamento Estruturado", issuer: "Qualificação profissional" },
  ],
  /** Área geográfica de atuação direta. */
  areaOfService: [
    "Curitiba",
    "São José dos Pinhais",
    "Pinhais",
    "Colombo",
    "Araucária",
  ],
  nationalNote:
    "Demais cidades do Brasil são atendidas por prestadores parceiros homologados, sob o mesmo protocolo de triagem.",
} as const;

export const MANAGER_URL = `${COMPANY.website}/gestor-responsavel`;
