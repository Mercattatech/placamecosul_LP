export async function trackEvent(_eventType: string, _properties: Record<string, any> = {}): Promise<void> {}

export const analytics = {
  pageView: () => {},
  ctaClick: (_location: string) => {},
  formStart: (_formId: string) => {},
  formSubmit: (_formId: string, _extra?: Record<string, any>) => {},
  formSuccess: (_formId: string) => {},
  formError: (_formId: string, _error: string) => {},
  faqClick: (_question: string, _index: number) => {},
  scrollDepth: (_depth: number) => {},
  sectionView: (_section: string) => {},
  exitIntent: () => {},
  timeOnPage: (_seconds: number) => {},
  navClick: (_destination: string) => {},
};
