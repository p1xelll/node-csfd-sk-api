import { CSFDSearch } from "../dto/search.cjs";
import { CSFDOptions } from "../dto/options.cjs";

//#region src/services/search.service.d.ts
declare class SearchScraper {
  search(text: string, options?: CSFDOptions): Promise<CSFDSearch>;
  private parseSearch;
}
//#endregion
export { SearchScraper };
//# sourceMappingURL=search.service.d.cts.map