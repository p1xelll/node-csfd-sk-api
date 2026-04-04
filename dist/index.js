import { CinemaScraper } from "./services/cinema.service.js";
import { CreatorScraper } from "./services/creator.service.js";
import { MovieScraper } from "./services/movie.service.js";
import { SearchScraper } from "./services/search.service.js";
import { UserRatingsScraper } from "./services/user-ratings.service.js";
import { UserReviewsScraper } from "./services/user-reviews.service.js";
//#region src/index.ts
var Csfd = class {
	defaultOptions;
	constructor(userRatingsService, userReviewsService, movieService, creatorService, searchService, cinemaService, defaultOptions) {
		this.userRatingsService = userRatingsService;
		this.userReviewsService = userReviewsService;
		this.movieService = movieService;
		this.creatorService = creatorService;
		this.searchService = searchService;
		this.cinemaService = cinemaService;
		this.defaultOptions = defaultOptions;
	}
	setOptions({ request, language, domain }) {
		if (request !== void 0) this.defaultOptions = {
			...this.defaultOptions,
			request
		};
		if (language !== void 0) this.defaultOptions = {
			...this.defaultOptions,
			language
		};
		if (domain !== void 0) this.defaultOptions = {
			...this.defaultOptions,
			domain
		};
	}
	async userRatings(user, config, options) {
		const opts = options ?? this.defaultOptions;
		return this.userRatingsService.userRatings(user, config, opts);
	}
	async userReviews(user, config, options) {
		const opts = options ?? this.defaultOptions;
		return this.userReviewsService.userReviews(user, config, opts);
	}
	async movie(movie, options) {
		const opts = options ?? this.defaultOptions;
		return this.movieService.movie(+movie, opts);
	}
	async creator(creator, options) {
		const opts = options ?? this.defaultOptions;
		return this.creatorService.creator(+creator, opts);
	}
	async search(text, options) {
		const opts = options ?? this.defaultOptions;
		return this.searchService.search(text, opts);
	}
	async cinema(district, period, options) {
		const opts = options ?? this.defaultOptions;
		return this.cinemaService.cinemas(+district, period, opts);
	}
};
const movieScraper = new MovieScraper();
const userRatingsScraper = new UserRatingsScraper();
const userReviewsScraper = new UserReviewsScraper();
const cinemaScraper = new CinemaScraper();
const csfd = new Csfd(userRatingsScraper, userReviewsScraper, movieScraper, new CreatorScraper(), new SearchScraper(), cinemaScraper);
//#endregion
export { Csfd, csfd };

//# sourceMappingURL=index.js.map