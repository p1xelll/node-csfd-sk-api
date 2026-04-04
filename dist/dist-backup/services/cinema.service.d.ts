import { CSFDCinema, CSFDCinemaPeriod } from "../dto/cinema.js";
import { CSFDOptions } from "../dto/options.js";

//#region src/services/cinema.service.d.ts
declare class CinemaScraper {
  cinemas(district?: number, period?: CSFDCinemaPeriod, options?: CSFDOptions): Promise<CSFDCinema[]>;
  private buildCinemas;
}
//#endregion
export { CinemaScraper };
//# sourceMappingURL=cinema.service.d.ts.map