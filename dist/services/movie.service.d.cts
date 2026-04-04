import { CSFDMovie } from "../dto/movie.cjs";
import { CSFDOptions } from "../dto/options.cjs";

//#region src/services/movie.service.d.ts
declare class MovieScraper {
  movie(movieId: number, options?: CSFDOptions): Promise<CSFDMovie>;
  private buildMovie;
}
//#endregion
export { MovieScraper };
//# sourceMappingURL=movie.service.d.cts.map