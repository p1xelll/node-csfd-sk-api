import { CSFDSearch } from "../dto/search.js";
import { CSFDOptions } from "../dto/options.js";

//#region src/services/search.service.d.ts
declare class SearchScraper {
  search(text: string, options?: CSFDOptions): Promise<CSFDSearch>;
  private parseSearch;
}
//#endregion
export { SearchScraper };
//# sourceMappingURL=search.service.d.ts.map