import { CSFDCreator } from "../dto/creator.js";
import { CSFDOptions } from "../dto/options.js";

//#region src/services/creator.service.d.ts
declare class CreatorScraper {
  creator(creatorId: number, options?: CSFDOptions): Promise<CSFDCreator>;
  private buildCreator;
}
//#endregion
export { CreatorScraper };
//# sourceMappingURL=creator.service.d.ts.map