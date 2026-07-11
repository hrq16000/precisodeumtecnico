/**
 * Analytics configuration — Rodada 25.1 Bloco B (Opção C: DESATIVADO).
 *
 * Esta camada permanece explicitamente desligada. Nada aqui inicia GTM,
 * GA4, ou qualquer transmissão externa. A tag Google Ads preexistente
 * (AW-16491950534) no `index.html` é preservada e independente desta
 * infraestrutura — não migrar, não ampliar.
 *
 * Ativação futura exigirá:
 *  1. GTM Container ID real fornecido pelo dono do projeto;
 *  2. Decisão formal de consentimento (CMP/banner se aplicável);
 *  3. Revisão da política de privacidade;
 *  4. Nova aprovação explícita e publicação do container.
 *
 * NÃO adicionar lógica que ative GTM automaticamente com base em
 * variável de ambiente. Ativação sempre deve ser deliberada.
 */

export const analyticsConfig = {
  /** Se true, futura infraestrutura poderia injetar loader GTM. Sempre false nesta rodada. */
  gtmEnabled: false as const,
  /** ID real do container GTM. Undefined enquanto desativado. */
  gtmId: undefined as string | undefined,
  /** Marca que a camada local (dataLayer + eventos) está ativa apenas no navegador. */
  localDataLayerEnabled: true as const,
} as const;

export type AnalyticsConfig = typeof analyticsConfig;
