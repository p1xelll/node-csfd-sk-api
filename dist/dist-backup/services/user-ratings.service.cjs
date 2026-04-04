const require_vars = require("../vars.cjs");
const require_index = require("../fetchers/index.cjs");
const require_global_helper = require("../helpers/global.helper.cjs");
const require_user_ratings_helper = require("../helpers/user-ratings.helper.cjs");
let node_html_parser = require("node-html-parser");
//#region src/services/user-ratings.service.ts
var UserRatingsScraper = class {
	async userRatings(user, config, options) {
		let allMovies = [];
		const pageToFetch = config?.page || 1;
		const items = (0, node_html_parser.parse)(await require_index.fetchPage(require_vars.userRatingsUrl(user, pageToFetch > 1 ? pageToFetch : void 0, {
			language: options?.language,
			domain: options?.domain
		}), { ...options?.request }));
		const movies = items.querySelectorAll("#snippet--ratings table tr");
		const pagesNode = items.querySelector(".pagination");
		const pages = +pagesNode?.childNodes[pagesNode.childNodes.length - 4].rawText || 1;
		const baseUrl = require_vars.getBaseUrl(options?.domain, options?.language);
		allMovies = this.getPage(config, movies, baseUrl);
		if (config?.allPages) {
			for (let i = 2; i <= pages; i++) {
				config.onProgress?.(i, pages);
				const movies = (0, node_html_parser.parse)(await require_index.fetchPage(require_vars.userRatingsUrl(user, i, {
					language: options?.language,
					domain: options?.domain
				}), { ...options?.request })).querySelectorAll("#snippet--ratings table tr");
				allMovies = [...allMovies, ...this.getPage(config, movies, baseUrl)];
				if (config.allPagesDelay) await require_global_helper.sleep(config.allPagesDelay);
			}
			return allMovies;
		}
		return allMovies;
	}
	getPage(config, movies, baseUrl) {
		const films = [];
		if (config) {
			if (config.includesOnly?.length && config.excludes?.length) console.warn(`${require_vars.LIB_PREFIX} Both 'includesOnly' and 'excludes' were provided. 'includesOnly' takes precedence:`, config.includesOnly);
		}
		const includesSet = config?.includesOnly?.length ? new Set(config.includesOnly) : null;
		const excludesSet = config?.excludes?.length ? new Set(config.excludes) : null;
		for (const el of movies) {
			const type = require_user_ratings_helper.getUserRatingType(el);
			if (includesSet) {
				if (includesSet.has(type)) films.push(this.buildUserRatings(el, type, baseUrl));
			} else if (excludesSet) {
				if (!excludesSet.has(type)) films.push(this.buildUserRatings(el, type, baseUrl));
			} else films.push(this.buildUserRatings(el, type, baseUrl));
		}
		return films;
	}
	buildUserRatings(el, type, baseUrl) {
		return {
			id: require_user_ratings_helper.getUserRatingId(el),
			title: require_user_ratings_helper.getUserRatingTitle(el),
			year: require_user_ratings_helper.getUserRatingYear(el),
			type,
			url: require_user_ratings_helper.getUserRatingUrl(el, baseUrl),
			colorRating: require_user_ratings_helper.getUserRatingColorRating(el),
			userDate: require_user_ratings_helper.getUserRatingDate(el),
			userRating: require_user_ratings_helper.getUserRating(el)
		};
	}
};
//#endregion
exports.UserRatingsScraper = UserRatingsScraper;

//# sourceMappingURL=user-ratings.service.cjs.map