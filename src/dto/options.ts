export type CSFDLanguage = 'cs' | 'en' | 'sk';
export type CSFDDomain = 'cz' | 'sk';

export interface CSFDOptions {
  language?: CSFDLanguage;
  domain?: CSFDDomain;
  request?: RequestInit;
}
