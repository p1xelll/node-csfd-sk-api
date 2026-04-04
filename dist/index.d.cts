import { CSFDColorRating, CSFDFilmTypes, CSFDScreening, CSFDStars } from "./dto/global.cjs";
import { CSFDBoxContent, CSFDCreatorGroups, CSFDCreatorGroupsEnglish, CSFDCreatorGroupsSlovak, CSFDCreators, CSFDGenres, CSFDMovie, CSFDMovieCreator, CSFDMovieListItem, CSFDParent, CSFDPremiere, CSFDSeriesChild, CSFDTitlesOther, CSFDVod, CSFDVodService, MovieJsonLd } from "./dto/movie.cjs";
import { CSFDCinema, CSFDCinemaGroupedFilmsByDate, CSFDCinemaMeta, CSFDCinemaMovie, CSFDCinemaPeriod } from "./dto/cinema.cjs";
import { CSFDCreator, CSFDCreatorScreening } from "./dto/creator.cjs";
import { CSFDSearch, CSFDSearchCreator, CSFDSearchCreators, CSFDSearchMovie, CSFDSearchUser } from "./dto/search.cjs";
import { CSFDColors, CSFDUserRatingConfig, CSFDUserRatings } from "./dto/user-ratings.cjs";
import { CSFDUserReviews, CSFDUserReviewsConfig } from "./dto/user-reviews.cjs";
import { CSFDOptions } from "./dto/options.cjs";
import { CinemaScraper } from "./services/cinema.service.cjs";
import { CreatorScraper } from "./services/creator.service.cjs";
import { MovieScraper } from "./services/movie.service.cjs";
import { SearchScraper } from "./services/search.service.cjs";
import { UserRatingsScraper } from "./services/user-ratings.service.cjs";
import { UserReviewsScraper } from "./services/user-reviews.service.cjs";

//#region src/index.d.ts
declare class Csfd {
  private userRatingsService;
  private userReviewsService;
  private movieService;
  private creatorService;
  private searchService;
  private cinemaService;
  private defaultOptions?;
  constructor(userRatingsService: UserRatingsScraper, userReviewsService: UserReviewsScraper, movieService: MovieScraper, creatorService: CreatorScraper, searchService: SearchScraper, cinemaService: CinemaScraper, defaultOptions?: CSFDOptions);
  setOptions({
    request,
    language,
    domain
  }: CSFDOptions): void;
  userRatings(user: string | number, config?: CSFDUserRatingConfig, options?: CSFDOptions): Promise<CSFDUserRatings[]>;
  userReviews(user: string | number, config?: CSFDUserReviewsConfig, options?: CSFDOptions): Promise<CSFDUserReviews[]>;
  movie(movie: number, options?: CSFDOptions): Promise<CSFDMovie>;
  creator(creator: number, options?: CSFDOptions): Promise<CSFDCreator>;
  search(text: string, options?: CSFDOptions): Promise<CSFDSearch>;
  cinema(district: number | string, period: CSFDCinemaPeriod, options?: CSFDOptions): Promise<CSFDCinema[]>;
}
declare const csfd: Csfd;
//#endregion
export { CSFDBoxContent, CSFDCinema, CSFDCinemaGroupedFilmsByDate, CSFDCinemaMeta, CSFDCinemaMovie, CSFDCinemaPeriod, CSFDColorRating, CSFDColors, CSFDCreator, CSFDCreatorGroups, CSFDCreatorGroupsEnglish, CSFDCreatorGroupsSlovak, CSFDCreatorScreening, CSFDCreators, CSFDFilmTypes, CSFDGenres, CSFDMovie, CSFDMovieCreator, CSFDMovieListItem, CSFDParent, CSFDPremiere, CSFDScreening, CSFDSearch, CSFDSearchCreator, CSFDSearchCreators, CSFDSearchMovie, CSFDSearchUser, CSFDSeriesChild, CSFDStars, CSFDTitlesOther, CSFDUserRatingConfig, CSFDUserRatings, CSFDVod, CSFDVodService, Csfd, MovieJsonLd, csfd };
//# sourceMappingURL=index.d.cts.map