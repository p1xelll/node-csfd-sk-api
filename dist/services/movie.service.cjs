const require_vars = require("../vars.cjs");
const require_index = require("../fetchers/index.cjs");
const require_movie_helper = require("../helpers/movie.helper.cjs");
let node_html_parser = require("node-html-parser");
//#region src/services/movie.service.ts
var MovieScraper = class {
	async movie(movieId, options) {
		const id = Number(movieId);
		if (isNaN(id)) throw new Error("node-csfd-api: movieId must be a valid number");
		const movieHtml = (0, node_html_parser.parse)(await require_index.fetchPage(require_vars.movieUrl(id, {
			language: options?.language,
			domain: options?.domain
		}), { ...options?.request }));
		const pageClasses = movieHtml.querySelector(".page-content").classNames.split(" ");
		const asideNode = movieHtml.querySelector(".aside-movie-profile");
		const movieNode = movieHtml.querySelector(".main-movie-profile");
		const jsonLdString = movieHtml.querySelector("script[type=\"application/ld+json\"]")?.textContent;
		let jsonLd = null;
		try {
			jsonLd = JSON.parse(jsonLdString);
		} catch (e) {
			console.error(require_vars.LIB_PREFIX + " Error parsing JSON-LD", e);
		}
		return this.buildMovie(+movieId, movieHtml, movieNode, asideNode, pageClasses, jsonLd, options);
	}
	buildMovie(movieId, movieHtml, el, asideEl, pageClasses, jsonLd, options) {
		const type = require_movie_helper.getMovieType(el);
		const { seriesName = null, seasonName = null } = type === "season" ? require_movie_helper.getSeriesAndSeasonTitle(el) : {};
		const seasonOrEpisodeListType = require_movie_helper.detectSeasonOrEpisodeListType(movieHtml);
		const baseUrl = require_vars.getBaseUrl(options?.domain, options?.language);
		return {
			id: movieId,
			title: type === "season" && seriesName ? seriesName : require_movie_helper.getMovieTitle(el),
			year: require_movie_helper.getMovieYear(jsonLd),
			duration: require_movie_helper.getMovieDuration(jsonLd, el),
			descriptions: require_movie_helper.getMovieDescriptions(el),
			genres: require_movie_helper.getMovieGenres(el),
			type,
			url: require_vars.movieUrl(movieId, {
				language: options?.language,
				domain: options?.domain
			}),
			origins: require_movie_helper.getMovieOrigins(el),
			colorRating: require_movie_helper.getMovieColorRating(pageClasses),
			rating: require_movie_helper.getMovieRating(asideEl),
			ratingCount: require_movie_helper.getMovieRatingCount(asideEl),
			titlesOther: require_movie_helper.getMovieTitlesOther(el),
			poster: require_movie_helper.getMoviePoster(el),
			photo: require_movie_helper.getMovieRandomPhoto(el),
			trivia: require_movie_helper.getMovieTrivia(el),
			creators: require_movie_helper.getMovieCreators(el, options, baseUrl),
			vod: require_movie_helper.getMovieVods(el),
			tags: require_movie_helper.getMovieTags(asideEl),
			premieres: require_movie_helper.getMoviePremieres(asideEl),
			related: require_movie_helper.getMovieBoxMovies(asideEl, "Související", baseUrl),
			similar: require_movie_helper.getMovieBoxMovies(asideEl, "Podobné", baseUrl),
			seasons: seasonOrEpisodeListType === "seasons" ? require_movie_helper.getSeasonsOrEpisodes(movieHtml, baseUrl) : null,
			episodes: seasonOrEpisodeListType === "episodes" ? require_movie_helper.getSeasonsOrEpisodes(movieHtml, baseUrl) : null,
			parent: type === "season" || type === "episode" ? require_movie_helper.getSeasonOrEpisodeParent(el, baseUrl) : null,
			episodeCode: type === "episode" ? require_movie_helper.getEpisodeCode(el) : null,
			seasonName
		};
	}
};
//#endregion
exports.MovieScraper = MovieScraper;

//# sourceMappingURL=movie.service.cjs.map