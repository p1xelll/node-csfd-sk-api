import { CSFDMovieListItem } from "./movie.js";

//#region src/dto/cinema.d.ts
interface CSFDCinema {
  id: number;
  name: string;
  city: string;
  url: string;
  coords: {
    lat: number;
    lng: number;
  };
  region?: string;
  screenings: CSFDCinemaGroupedFilmsByDate[];
}
interface CSFDCinemaGroupedFilmsByDate {
  date: string;
  films: CSFDCinemaMovie[];
}
interface CSFDCinemaMovie extends CSFDMovieListItem {
  meta: CSFDCinemaMeta[];
  showTimes: string[];
}
type CSFDCinemaMeta = 'dubbing' | '3D' | 'subtitles' | string;
type CSFDCinemaPeriod = 'today' | 'weekend' | 'week' | 'tomorrow' | 'month';
//#endregion
export { CSFDCinema, CSFDCinemaGroupedFilmsByDate, CSFDCinemaMeta, CSFDCinemaMovie, CSFDCinemaPeriod };
//# sourceMappingURL=cinema.d.ts.map