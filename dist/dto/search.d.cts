import { CSFDScreening } from "./global.cjs";
import { CSFDMovieCreator } from "./movie.cjs";

//#region src/dto/search.d.ts
interface CSFDSearch {
  movies: CSFDSearchMovie[];
  tvSeries: CSFDSearchMovie[];
  creators: CSFDSearchCreator[];
  users: CSFDSearchUser[];
}
interface CSFDSearchMovie extends CSFDScreening {
  poster: string;
  origins: string[];
  creators: CSFDSearchCreators;
}
interface CSFDSearchUser {
  id: number;
  user: string;
  userRealName: string;
  avatar: string;
  url: string;
}
interface CSFDSearchCreator extends CSFDMovieCreator {
  image: string;
}
interface CSFDSearchCreators {
  directors: CSFDMovieCreator[];
  actors: CSFDMovieCreator[];
}
//#endregion
export { CSFDSearch, CSFDSearchCreator, CSFDSearchCreators, CSFDSearchMovie, CSFDSearchUser };
//# sourceMappingURL=search.d.cts.map