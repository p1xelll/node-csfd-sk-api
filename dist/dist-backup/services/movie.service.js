import { LIB_PREFIX, getBaseUrl, movieUrl } from "../vars.js";
import { fetchPage } from "../fetchers/index.js";
import { detectSeasonOrEpisodeListType, getEpisodeCode, getMovieBoxMovies, getMovieColorRating, getMovieCreators, getMovieDescriptions, getMovieDuration, getMovieGenres, getMovieOrigins, getMoviePoster, getMoviePremieres, getMovieRandomPhoto, getMovieRating, getMovieRatingCount, getMovieTags, getMovieTitle, getMovieTitlesOther, getMovieTrivia, getMovieType, getMovieVods, getMovieYear, getSeasonOrEpisodeParent, getSeasonsOrEpisodes, getSeriesAndSeasonTitle } from "../helpers/movie.helper.js";
import { parse } from "node-html-parser";
//#region src/services/movie.service.ts
var MovieScraper = class {
	async movie(movieId, options) {
		const id = Number(movieId);
		if (isNaN(id)) throw new Error("node-csfd-api: movieId must be a valid number");
		const movieHtml = parse(await fetchPage(movieUrl(id, {
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
			console.error(LIB_PREFIX + " Error parsing JSON-LD", e);
		}
		return this.buildMovie(+movieId, movieHtml, movieNode, asideNode, pageClasses, jsonLd, options);
	}
	buildMovie(movieId, movieHtml, el, asideEl, pageClasses, jsonLd, options) {
		const type = getMovieType(el);
		const { seriesName = null, seasonName = null } = type === "season" ? getSeriesAndSeasonTitle(el) : {};
		const seasonOrEpisodeListType = detectSeasonOrEpisodeListType(movieHtml);
		const baseUrl = getBaseUrl(options?.domain, options?.language);
		return {
			id: movieId,
			title: type === "season" && seriesName ? seriesName : getMovieTitle(el),
			year: getMovieYear(jsonLd),
			duration: getMovieDuration(jsonLd, el),
			descriptions: getMovieDescriptions(el),
			genres: getMovieGenres(el),
			type,
			url: movieUrl(movieId, {
				language: options?.language,
				domain: options?.domain
			}),
			origins: getMovieOrigins(el),
			colorRating: getMovieColorRating(pageClasses),
			rating: getMovieRating(asideEl),
			ratingCount: getMovieRatingCount(asideEl),
			titlesOther: getMovieTitlesOther(el),
			poster: getMoviePoster(el),
			photo: getMovieRandomPhoto(el),
			trivia: getMovieTrivia(el),
			creators: getMovieCreators(el, options, baseUrl),
			vod: getMovieVods(el),
			tags: getMovieTags(asideEl),
			premieres: getMoviePremieres(asideEl),
			related: getMovieBoxMovies(asideEl, "Související", baseUrl),
			similar: getMovieBoxMovies(asideEl, "Podobné", baseUrl),
			seasons: seasonOrEpisodeListType === "seasons" ? getSeasonsOrEpisodes(movieHtml, baseUrl) : null,
			episodes: seasonOrEpisodeListType === "episodes" ? getSeasonsOrEpisodes(movieHtml, baseUrl) : null,
			parent: type === "season" || type === "episode" ? getSeasonOrEpisodeParent(el, baseUrl) : null,
			episodeCode: type === "episode" ? getEpisodeCode(el) : null,
			seasonName
		};
	}
};
//#endregion
export { MovieScraper };

//# sourceMappingURL=movie.service.js.map