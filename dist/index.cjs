Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const require_cinema_service = require("./services/cinema.service.cjs");
const require_creator_service = require("./services/creator.service.cjs");
const require_movie_service = require("./services/movie.service.cjs");
const require_search_service = require("./services/search.service.cjs");
const require_user_ratings_service = require("./services/user-ratings.service.cjs");
const require_user_reviews_service = require("./services/user-reviews.service.cjs");
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
const movieScraper = new require_movie_service.MovieScraper();
const userRatingsScraper = new require_user_ratings_service.UserRatingsScraper();
const userReviewsScraper = new require_user_reviews_service.UserReviewsScraper();
const cinemaScraper = new require_cinema_service.CinemaScraper();
const csfd = new Csfd(userRatingsScraper, userReviewsScraper, movieScraper, new require_creator_service.CreatorScraper(), new require_search_service.SearchScraper(), cinemaScraper);
//#endregion
exports.Csfd = Csfd;
exports.csfd = csfd;

//# sourceMappingURL=index.cjs.map