import { CSFDCinema, CSFDCinemaPeriod } from "../dto/cinema.cjs";
import { CSFDOptions } from "../dto/options.cjs";

//#region src/services/cinema.service.d.ts
declare class CinemaScraper {
  cinemas(district?: number, period?: CSFDCinemaPeriod, options?: CSFDOptions): Promise<CSFDCinema[]>;
  private buildCinemas;
}
//#endregion
export { CinemaScraper };
//# sourceMappingURL=cinema.service.d.cts.map