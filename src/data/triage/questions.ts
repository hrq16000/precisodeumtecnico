/**
 * Catálogo de perguntas contextuais por equipamento (Rodada 26).
 * Este é o ÚNICO lugar para editar copy de perguntas do funil.
 */
import type { EquipmentId } from "./config";

export type QuestionType = "single" | "text" | "textarea";

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  label: string;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  options?: QuestionOption[];
  /** Mostra a pergunta apenas se `predicate(answers)` retornar true. */
  when?: (answers: Record<string, string>) => boolean;
  /** Marca perguntas que definem o "sintoma principal" (usado pelo motor). */
  isSymptom?: boolean;
  /** Marca a resposta que define "aparelho liga?" (necessário para rota remota). */
  isPowerOn?: boolean;
  /** Marca a resposta que define "objetivo/intenção" para PC. */
  isIntent?: boolean;
}

export interface EquipmentQuestionnaire {
  device: Question[];       // Etapa 2 — identificação
  symptom: Question[];      // Etapa 2 — sintoma principal
  contextual: Question[];   // Etapa 3 — perguntas condicionais
}

// ---------------------------------------------------------------------------
// PC / NOTEBOOK
// ---------------------------------------------------------------------------
const pc: EquipmentQuestionnaire = {
  device: [
    {
      id: "pc_type", type: "single", label: "Qual é o tipo?",
      options: [
        { value: "desktop", label: "Computador desktop" },
        { value: "notebook", label: "Notebook" },
        { value: "aio", label: "All-in-one" },
        { value: "unknown", label: "Não sei informar" },
      ],
      required: true,
    },
    { id: "brand", type: "text", label: "Marca (se souber)", placeholder: "Dell, Lenovo, HP…", optional: true },
    { id: "model", type: "text", label: "Modelo (se souber)", placeholder: "Ex.: Inspiron 15", optional: true },
    {
      id: "power", type: "single", label: "O equipamento liga?",
      options: [
        { value: "boots_ok", label: "Liga e inicia normalmente" },
        { value: "boots_no_os", label: "Liga, mas não inicia o sistema" },
        { value: "boots_off", label: "Liga e desliga" },
        { value: "no_power", label: "Não liga" },
        { value: "unknown", label: "Não sei informar" },
      ],
      required: true, isPowerOn: true,
    },
  ],
  symptom: [
    {
      id: "symptom", type: "single", label: "Qual é o principal objetivo?",
      isSymptom: true, isIntent: true, required: true,
      options: [
        { value: "install_config",  label: "Instalar ou configurar programa" },
        { value: "virus_slow",      label: "Remover vírus ou lentidão" },
        { value: "printer_periph",  label: "Configurar impressora ou periférico" },
        { value: "windows_system",  label: "Problema no Windows ou sistema" },
        { value: "recover_files",   label: "Recuperar arquivos" },
        { value: "swap_component",  label: "Trocar ou instalar componente" },
        { value: "screen_kb_bat",   label: "Problema de tela, teclado ou bateria" },
        { value: "no_power_board",  label: "Não liga ou possível defeito de placa" },
        { value: "other",           label: "Outro" },
      ],
    },
    { id: "symptom_other", type: "textarea", label: "Descreva com mais detalhes", when: (a) => a.symptom === "other", required: true },
  ],
  contextual: [
    {
      id: "when_started", type: "single", label: "Quando o problema começou?",
      when: (a) => ["virus_slow", "windows_system", "install_config", "printer_periph"].includes(a.symptom),
      options: [
        { value: "today", label: "Hoje" },
        { value: "week",  label: "Nesta semana" },
        { value: "older", label: "Faz mais de uma semana" },
      ],
    },
    {
      id: "important_files", type: "single", label: "Existem arquivos importantes no equipamento?",
      options: [
        { value: "yes",  label: "Sim, preciso preservar" },
        { value: "no",   label: "Não" },
        { value: "unsure", label: "Não tenho certeza" },
      ],
    },
    {
      id: "prev_repair", type: "single", label: "Já passou por outra assistência?",
      options: [
        { value: "yes", label: "Sim" },
        { value: "no",  label: "Não" },
      ],
    },
    { id: "notes", type: "textarea", label: "Alguma informação adicional?", optional: true },
  ],
};

// ---------------------------------------------------------------------------
// TV
// ---------------------------------------------------------------------------
const tv: EquipmentQuestionnaire = {
  device: [
    {
      id: "tv_type", type: "single", label: "Tipo aproximado",
      options: [
        { value: "led", label: "LED" }, { value: "lcd", label: "LCD" },
        { value: "oled", label: "OLED" }, { value: "qled", label: "QLED" },
        { value: "unknown", label: "Não sei informar" },
      ], required: true,
    },
    { id: "size_inches", type: "text", label: "Tamanho em polegadas (se souber)", placeholder: "Ex.: 55", optional: true },
    { id: "brand", type: "text", label: "Marca (se souber)", placeholder: "Samsung, LG…", optional: true },
    { id: "model", type: "text", label: "Modelo (se souber)", optional: true },
  ],
  symptom: [
    {
      id: "symptom", type: "single", label: "O que aconteceu?",
      isSymptom: true, required: true,
      options: [
        { value: "screen_broken",   label: "Tela quebrada" },
        { value: "screen_lines",    label: "Linhas na imagem" },
        { value: "screen_stains",   label: "Manchas na tela" },
        { value: "dark_with_sound", label: "Tela escura com som" },
        { value: "blink_on_off",    label: "Acende e apaga" },
        { value: "no_power",        label: "Não liga" },
        { value: "no_image",        label: "Sem imagem" },
        { value: "no_sound",        label: "Sem som" },
        { value: "image_defect",    label: "Imagem com defeito" },
        { value: "other",           label: "Outro" },
      ],
    },
    { id: "symptom_other", type: "textarea", label: "Descreva o defeito", when: (a) => a.symptom === "other", required: true },
  ],
  contextual: [
    {
      id: "when_happened", type: "single",
      label: "Quando aconteceu?",
      when: (a) => ["screen_broken"].includes(a.symptom),
      options: [
        { value: "today", label: "Hoje" }, { value: "week", label: "Nesta semana" }, { value: "older", label: "Faz mais tempo" },
      ],
    },
    {
      id: "when_started", type: "single", label: "Quando começou?",
      when: (a) => ["image_defect","no_sound","dark_with_sound","screen_lines","screen_stains"].includes(a.symptom),
      options: [
        { value: "today", label: "Hoje" }, { value: "week", label: "Nesta semana" }, { value: "older", label: "Faz mais tempo" },
      ],
    },
    {
      id: "frequency", type: "single", label: "Com que frequência acontece?",
      when: (a) => ["blink_on_off","image_defect","no_sound"].includes(a.symptom),
      options: [
        { value: "always", label: "O tempo todo" }, { value: "intermittent", label: "Às vezes" },
      ],
    },
    { id: "notes", type: "textarea", label: "Alguma informação adicional?", optional: true },
  ],
};

// ---------------------------------------------------------------------------
// CELULAR / TABLET
// ---------------------------------------------------------------------------
const celular: EquipmentQuestionnaire = {
  device: [
    {
      id: "device_kind", type: "single", label: "Celular ou tablet?",
      options: [{ value: "phone", label: "Celular" }, { value: "tablet", label: "Tablet" }], required: true,
    },
    { id: "brand", type: "text", label: "Marca", placeholder: "Apple, Samsung, Motorola…", required: true },
    { id: "model", type: "text", label: "Modelo (se souber)", optional: true },
    {
      id: "age", type: "single", label: "Idade aproximada",
      options: [
        { value: "0_1", label: "Menos de 1 ano" }, { value: "1_3", label: "1 a 3 anos" },
        { value: "3_5", label: "3 a 5 anos" }, { value: "5+", label: "Mais de 5 anos" },
        { value: "unknown", label: "Não sei" },
      ],
    },
  ],
  symptom: [
    {
      id: "symptom", type: "single", label: "O que aconteceu?",
      isSymptom: true, required: true,
      options: [
        { value: "dropped",   label: "Caiu" },
        { value: "wet",       label: "Molhou" },
        { value: "screen_broken", label: "Tela quebrou" },
        { value: "screen_off",label: "Tela sem imagem" },
        { value: "no_power",  label: "Não liga" },
        { value: "no_charge", label: "Não carrega" },
        { value: "battery",   label: "Bateria descarrega rápido" },
        { value: "reboots",   label: "Reinicia ou trava" },
        { value: "cam_audio", label: "Câmera, áudio ou conector" },
        { value: "other",     label: "Outro" },
      ],
    },
    { id: "symptom_other", type: "textarea", label: "Descreva o defeito", when: (a) => a.symptom === "other", required: true },
  ],
  contextual: [
    // molhou
    {
      id: "wet_when", type: "single", label: "Quando aconteceu?",
      when: (a) => a.symptom === "wet",
      options: [
        { value: "today", label: "Hoje" }, { value: "yesterday", label: "Ontem" },
        { value: "week",  label: "Nesta semana" }, { value: "older", label: "Faz mais tempo" },
      ], required: true,
    },
    {
      id: "wet_tried_power", type: "single", label: "Tentou ligar ou carregar depois?",
      when: (a) => a.symptom === "wet",
      options: [{ value: "yes", label: "Sim" }, { value: "no", label: "Não" }], required: true,
    },
    {
      id: "wet_still_on", type: "single", label: "O aparelho ainda está ligado?",
      when: (a) => a.symptom === "wet",
      options: [{ value: "yes", label: "Sim" }, { value: "no", label: "Não" }],
    },
    {
      id: "wet_liquid", type: "single", label: "Foi contato com água, chuva, piscina ou outro líquido?",
      when: (a) => a.symptom === "wet",
      options: [
        { value: "water",  label: "Água" }, { value: "rain", label: "Chuva" },
        { value: "pool",   label: "Piscina/mar" }, { value: "other", label: "Outro líquido" },
      ],
    },
    // caiu
    {
      id: "drop_screen", type: "single", label: "A tela quebrou?",
      when: (a) => a.symptom === "dropped",
      options: [{ value: "yes", label: "Sim" }, { value: "no", label: "Não" }], required: true,
    },
    {
      id: "drop_bent", type: "single", label: "A estrutura entortou?",
      when: (a) => a.symptom === "dropped",
      options: [{ value: "yes", label: "Sim" }, { value: "no", label: "Não" }],
    },
    {
      id: "drop_power", type: "single", label: "O aparelho ainda liga?",
      when: (a) => a.symptom === "dropped",
      options: [{ value: "yes", label: "Sim" }, { value: "no", label: "Não" }],
    },
    // não carrega
    {
      id: "charge_tested_cable", type: "single", label: "Já testou outro cabo e carregador compatíveis?",
      when: (a) => a.symptom === "no_charge",
      options: [{ value: "yes", label: "Sim" }, { value: "no", label: "Não" }], required: true,
    },
    {
      id: "charge_connector", type: "single", label: "O conector está frouxo ou danificado?",
      when: (a) => a.symptom === "no_charge",
      options: [{ value: "yes", label: "Sim" }, { value: "no", label: "Não" }, { value: "unknown", label: "Não sei" }],
    },
    { id: "notes", type: "textarea", label: "Alguma informação adicional?", optional: true },
  ],
};

// ---------------------------------------------------------------------------
// SURFACE
// ---------------------------------------------------------------------------
const surface: EquipmentQuestionnaire = {
  device: [
    { id: "model", type: "text", label: "Modelo ou linha do Surface (se souber)", placeholder: "Ex.: Surface Pro 8", optional: true },
    {
      id: "age", type: "single", label: "Idade aproximada",
      options: [
        { value: "0_1", label: "Menos de 1 ano" }, { value: "1_3", label: "1 a 3 anos" },
        { value: "3_5", label: "3 a 5 anos" }, { value: "5+", label: "Mais de 5 anos" },
        { value: "unknown", label: "Não sei" },
      ],
    },
    {
      id: "power", type: "single", label: "O equipamento liga?",
      options: [
        { value: "boots_ok", label: "Liga normalmente" },
        { value: "boots_no_os", label: "Liga mas não inicia" },
        { value: "no_power", label: "Não liga" },
        { value: "unknown", label: "Não sei" },
      ], required: true, isPowerOn: true,
    },
  ],
  symptom: [
    {
      id: "symptom", type: "single", label: "O que aconteceu?", isSymptom: true, required: true,
      options: [
        { value: "screen_broken", label: "Tela quebrada" },
        { value: "no_power",      label: "Não liga" },
        { value: "no_charge",     label: "Não carrega" },
        { value: "battery",       label: "Bateria" },
        { value: "keyboard",      label: "Teclado" },
        { value: "system",        label: "Sistema" },
        { value: "overheat",      label: "Superaquecimento" },
        { value: "other",         label: "Outro" },
      ],
    },
    { id: "symptom_other", type: "textarea", label: "Descreva", when: (a) => a.symptom === "other", required: true },
  ],
  contextual: [
    { id: "notes", type: "textarea", label: "Informação adicional?", optional: true },
  ],
};

// ---------------------------------------------------------------------------
// SOM / RECEIVER / ÁUDIO
// ---------------------------------------------------------------------------
const som: EquipmentQuestionnaire = {
  device: [
    {
      id: "audio_kind", type: "single", label: "Qual equipamento?", required: true,
      options: [
        { value: "receiver",  label: "Receiver" },
        { value: "amp",       label: "Amplificador" },
        { value: "active_spk",label: "Caixa ativa" },
        { value: "soundbar",  label: "Soundbar" },
        { value: "hometheater",label: "Home theater" },
        { value: "stereo",    label: "Aparelho de som" },
        { value: "other",     label: "Outro" },
      ],
    },
    { id: "brand", type: "text", label: "Marca (se souber)", optional: true },
    { id: "model", type: "text", label: "Modelo (se souber)", optional: true },
    {
      id: "age", type: "single", label: "Idade aproximada",
      options: [
        { value: "0_1", label: "Menos de 1 ano" }, { value: "1_3", label: "1 a 3 anos" },
        { value: "3_5", label: "3 a 5 anos" }, { value: "5+", label: "Mais de 5 anos" },
        { value: "unknown", label: "Não sei" },
      ],
    },
  ],
  symptom: [
    {
      id: "symptom", type: "single", label: "O que aconteceu?", isSymptom: true, required: true,
      options: [
        { value: "no_power",     label: "Não liga" },
        { value: "no_sound",     label: "Liga sem som" },
        { value: "sound_fail",   label: "Som falhando" },
        { value: "one_channel",  label: "Um canal não funciona" },
        { value: "noise",        label: "Ruído ou chiado" },
        { value: "turns_off",    label: "Desliga sozinho" },
        { value: "input_fail",   label: "Entrada não funciona" },
        { value: "other",        label: "Outro" },
      ],
    },
    { id: "symptom_other", type: "textarea", label: "Descreva", when: (a) => a.symptom === "other", required: true },
  ],
  contextual: [
    {
      id: "frequency", type: "single", label: "Com que frequência acontece?",
      when: (a) => ["sound_fail","turns_off","noise"].includes(a.symptom),
      options: [
        { value: "always", label: "O tempo todo" }, { value: "intermittent", label: "Às vezes" },
      ],
    },
    { id: "notes", type: "textarea", label: "Informação adicional?", optional: true },
  ],
};

// ---------------------------------------------------------------------------
// VIDEOGAME
// ---------------------------------------------------------------------------
const videogame: EquipmentQuestionnaire = {
  device: [
    { id: "console_model", type: "text", label: "Qual videogame?", placeholder: "PS5, Xbox Series X, Switch…", required: true },
    { id: "brand", type: "text", label: "Marca (se diferente)", optional: true },
    { id: "model", type: "text", label: "Modelo/versão (se souber)", optional: true },
    {
      id: "age", type: "single", label: "Idade aproximada",
      options: [
        { value: "0_1", label: "Menos de 1 ano" }, { value: "1_3", label: "1 a 3 anos" },
        { value: "3_5", label: "3 a 5 anos" }, { value: "5+", label: "Mais de 5 anos" },
        { value: "unknown", label: "Não sei" },
      ],
    },
  ],
  symptom: [
    {
      id: "symptom", type: "single", label: "O que aconteceu?", isSymptom: true, required: true,
      options: [
        { value: "no_power",   label: "Não liga" },
        { value: "turns_off",  label: "Desliga sozinho" },
        { value: "overheat",   label: "Superaquece" },
        { value: "no_disc",    label: "Não lê disco" },
        { value: "no_image",   label: "Sem imagem" },
        { value: "controller", label: "Controle ou conexão" },
        { value: "hdmi",       label: "Porta HDMI" },
        { value: "system_err", label: "Erro de sistema" },
        { value: "other",      label: "Outro" },
      ],
    },
    { id: "symptom_other", type: "textarea", label: "Descreva", when: (a) => a.symptom === "other", required: true },
  ],
  contextual: [
    {
      id: "frequency", type: "single", label: "Com que frequência acontece?",
      when: (a) => ["turns_off","overheat"].includes(a.symptom),
      options: [
        { value: "always", label: "O tempo todo" }, { value: "intermittent", label: "Às vezes" },
      ],
    },
    { id: "notes", type: "textarea", label: "Informação adicional?", optional: true },
  ],
};

// ---------------------------------------------------------------------------
// OUTRO
// ---------------------------------------------------------------------------
const outro: EquipmentQuestionnaire = {
  device: [
    { id: "equipment_name", type: "text", label: "Qual é o equipamento?", required: true, placeholder: "Ex.: cafeteira profissional" },
    { id: "brand", type: "text", label: "Marca", required: true },
    { id: "model", type: "text", label: "Modelo (se souber)", optional: true },
    {
      id: "age", type: "single", label: "Quantos anos aproximadamente possui?",
      options: [
        { value: "0_1", label: "Menos de 1 ano" }, { value: "1_3", label: "1 a 3 anos" },
        { value: "3_5", label: "3 a 5 anos" }, { value: "5+", label: "Mais de 5 anos" },
        { value: "unknown", label: "Não sei" },
      ],
    },
    {
      id: "power", type: "single", label: "O equipamento liga?",
      options: [
        { value: "yes", label: "Sim" }, { value: "no", label: "Não" }, { value: "unknown", label: "Não sei" },
      ], required: true, isPowerOn: true,
    },
  ],
  symptom: [
    { id: "symptom", type: "textarea", label: "O que aconteceu?", isSymptom: true, required: true, placeholder: "Descreva com o máximo de detalhes" },
  ],
  contextual: [
    {
      id: "incident", type: "single", label: "Houve queda, líquido, impacto, cheiro de queimado ou oscilação elétrica?",
      options: [
        { value: "none", label: "Nada disso" }, { value: "drop", label: "Queda/impacto" },
        { value: "liquid", label: "Líquido" }, { value: "burn", label: "Cheiro de queimado" },
        { value: "surge", label: "Oscilação elétrica" },
      ], required: true,
    },
    {
      id: "prev_repair", type: "single", label: "Já houve tentativa de reparo?",
      options: [{ value: "yes", label: "Sim" }, { value: "no", label: "Não" }],
    },
    { id: "notes", type: "textarea", label: "Informação adicional importante?", optional: true },
  ],
};

export const QUESTIONNAIRES: Record<EquipmentId, EquipmentQuestionnaire> = {
  pc_notebook: pc,
  tv,
  celular_tablet: celular,
  surface,
  som_audio: som,
  videogame,
  outro,
};

export function getQuestionsForEquipment(id: EquipmentId): EquipmentQuestionnaire {
  return QUESTIONNAIRES[id];
}
