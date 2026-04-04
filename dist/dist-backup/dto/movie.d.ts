import { CSFDScreening } from "./global.js";

//#region src/dto/movie.d.ts
interface CSFDMovie extends CSFDScreening {
  rating: number | null;
  poster: string;
  photo: string;
  ratingCount: number | null;
  duration: number | string;
  titlesOther: CSFDTitlesOther[];
  origins: string[];
  descriptions: string[];
  trivia: string[];
  genres: CSFDGenres[] | string[];
  creators: CSFDCreators;
  vod: CSFDVod[];
  tags: string[];
  premieres: CSFDPremiere[];
  related: CSFDMovieListItem[];
  similar: CSFDMovieListItem[];
  seasons: CSFDSeriesChild[] | null;
  episodes: CSFDSeriesChild[] | null;
  parent: CSFDParent | null;
  episodeCode: string | null;
  seasonName: string | null;
}
interface CSFDParent {
  season: {
    id: number;
    title: string;
  } | null;
  series: {
    id: number;
    title: string;
  } | null;
}
interface MovieJsonLd {
  dateCreated?: string;
  duration?: string;
  [key: string]: any;
}
type CSFDVodService = 'Netflix' | 'hbogo' | 'Prime Video' | 'Apple TV+' | 'Apple TV' | 'iTunes' | 'KVIFF.TV' | 'Edisonline' | 'o2tv' | 'SledovaniTV' | 'Starmax' | 'DAFilms' | 'FILMY ČESKY A ZADARMO' | 'Youtube Česká filmová klasika' | 'VAPET' | 'VOREL FILM' | 'ivysilani' | 'Google Play' | 'Voyo' | 'YouTube Movies' | 'prima+' | 'Lepší.TV' | 'Blu-ray' | 'DVD';
interface CSFDVod {
  title: CSFDVodService;
  url: string;
}
interface CSFDCreators {
  directors: CSFDMovieCreator[];
  writers: CSFDMovieCreator[];
  cinematography: CSFDMovieCreator[];
  music: CSFDMovieCreator[];
  actors: CSFDMovieCreator[];
  basedOn: CSFDMovieCreator[];
  producers: CSFDMovieCreator[];
  filmEditing: CSFDMovieCreator[];
  costumeDesign: CSFDMovieCreator[];
  productionDesign: CSFDMovieCreator[];
  sound: CSFDMovieCreator[];
}
interface CSFDTitlesOther {
  country: string;
  title: string;
}
interface CSFDMovieCreator {
  /**
   * CSFD person ID.
   *
   * You can always assemble url from ID like this:
   *
   * `https://www.csfd.cz/tvurce/${id}`
   */
  id: number;
  name: string;
  url: string;
}
interface CSFDMovieListItem {
  id: number;
  title: string;
  url: string;
}
type CSFDGenres = 'Akční' | 'Animovaný' | 'Dobrodružný' | 'Dokumentární' | 'Drama' | 'Experimentální' | 'Fantasy' | 'Film-Noir' | 'Historický' | 'Horor' | 'Hudební' | 'IMAX' | 'Katastrofický' | 'Komedie' | 'Krátkometrážní' | 'Krimi' | 'Loutkový' | 'Muzikál' | 'Mysteriózní' | 'Naučný' | 'Podobenství' | 'Poetický' | 'Pohádka' | 'Povídkový' | 'Psychologický' | 'Publicistický' | 'Reality-TV' | 'Road movie' | 'Rodinný' | 'Romantický' | 'Sci-Fi' | 'Soutěžní' | 'Sportovní' | 'Stand-up' | 'Talk-show' | 'Taneční' | 'Telenovela' | 'Thriller' | 'Válečný' | 'Western' | 'Zábavný' | 'Životopisný';
type CSFDCreatorGroups = 'Režie' | 'Scénář' | 'Kamera' | 'Hudba' | 'Hrají' | 'Produkce' | 'Casting' | 'Střih' | 'Zvuk' | 'Masky' | 'Předloha' | 'Scénografie' | 'Kostýmy' | 'Zvuk';
type CSFDCreatorGroupsEnglish = 'Directed by' | 'Screenplay' | 'Cinematography' | 'Composer' | 'Cast' | 'Produced by' | 'Casting' | 'Editing' | 'Sound' | 'Make-up' | 'Production design' | 'Based on' | 'Costumes' | 'Sound';
type CSFDCreatorGroupsSlovak = 'Réžia' | 'Scenár' | 'Kamera' | 'Hudba' | 'Hrajú' | 'Predloha' | 'Produkcia' | 'Strih' | 'Kostýmy' | 'Scénografia' | 'Zvuk';
interface CSFDPremiere {
  country: string;
  format: string;
  date: string;
  company: string;
}
type CSFDBoxContent = 'Související' | 'Podobné' | 'Súvisiace';
interface CSFDSeriesChild {
  id: number;
  title: string;
  url: string;
  info: string | null;
}
//#endregion
export { CSFDBoxContent, CSFDCreatorGroups, CSFDCreatorGroupsEnglish, CSFDCreatorGroupsSlovak, CSFDCreators, CSFDGenres, CSFDMovie, CSFDMovieCreator, CSFDMovieListItem, CSFDParent, CSFDPremiere, CSFDSeriesChild, CSFDTitlesOther, CSFDVod, CSFDVodService, MovieJsonLd };
//# sourceMappingURL=movie.d.ts.map