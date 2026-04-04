import { CSFDMovie } from "../dto/movie.js";
import { CSFDOptions } from "../dto/options.js";

//#region src/services/movie.service.d.ts
declare class MovieScraper {
  movie(movieId: number, options?: CSFDOptions): Promise<CSFDMovie>;
  private buildMovie;
}
//#endregion
export { MovieScraper };
//# sourceMappingURL=movie.service.d.ts.map