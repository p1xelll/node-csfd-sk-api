//#region src/dto/options.d.ts
type CSFDLanguage = 'cs' | 'en' | 'sk';
type CSFDDomain = 'cz' | 'sk';
interface CSFDOptions {
  language?: CSFDLanguage;
  domain?: CSFDDomain;
  request?: RequestInit;
}
//#endregion
export { CSFDOptions };
//# sourceMappingURL=options.d.ts.map