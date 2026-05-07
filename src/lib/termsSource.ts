/**
 * Standardized analytics `source` values for the Terms popup.
 * Use these constants everywhere — never inline raw strings — so that
 * `terms_open`, `terms_accept` and `terms_full_page_click` events
 * always have consistent values in GA4 / GTM.
 */
export const TERMS_SOURCE = {
  hero: "hero",
  contactForm: "contact_form",
  quickForm: "quick_form",
  quiz: "quiz",
  bairro: "bairro_page",
  footer: "footer",
} as const;

export type TermsSource = (typeof TERMS_SOURCE)[keyof typeof TERMS_SOURCE];
