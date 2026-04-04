import { CSFDCreator } from "../dto/creator.cjs";
import { CSFDOptions } from "../dto/options.cjs";

//#region src/services/creator.service.d.ts
declare class CreatorScraper {
  creator(creatorId: number, options?: CSFDOptions): Promise<CSFDCreator>;
  private buildCreator;
}
//#endregion
export { CreatorScraper };
//# sourceMappingURL=creator.service.d.cts.map