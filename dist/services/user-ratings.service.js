import { LIB_PREFIX, getBaseUrl, userRatingsUrl } from "../vars.js";
import { fetchPage } from "../fetchers/index.js";
import { sleep } from "../helpers/global.helper.js";
import { getUserRating, getUserRatingColorRating, getUserRatingDate, getUserRatingId, getUserRatingTitle, getUserRatingType, getUserRatingUrl, getUserRatingYear } from "../helpers/user-ratings.helper.js";
import { parse } from "node-html-parser";
//#region src/services/user-ratings.service.ts
var UserRatingsScraper = class {
	async userRatings(user, config, options) {
		let allMovies = [];
		const pageToFetch = config?.page || 1;
		const items = parse(await fetchPage(userRatingsUrl(user, pageToFetch > 1 ? pageToFetch : void 0, {
			language: options?.language,
			domain: options?.domain
		}), { ...options?.request }));
		const movies = items.querySelectorAll("#snippet--ratings table tr");
		const pagesNode = items.querySelector(".pagination");
		const pages = +pagesNode?.childNodes[pagesNode.childNodes.length - 4].rawText || 1;
		const baseUrl = getBaseUrl(options?.domain, options?.language);
		allMovies = this.getPage(config, movies, baseUrl);
		if (config?.allPages) {
			for (let i = 2; i <= pages; i++) {
				config.onProgress?.(i, pages);
				const movies = parse(await fetchPage(userRatingsUrl(user, i, {
					language: options?.language,
					domain: options?.domain
				}), { ...options?.request })).querySelectorAll("#snippet--ratings table tr");
				allMovies = [...allMovies, ...this.getPage(config, movies, baseUrl)];
				if (config.allPagesDelay) await sleep(config.allPagesDelay);
			}
			return allMovies;
		}
		return allMovies;
	}
	getPage(config, movies, baseUrl) {
		const films = [];
		if (config) {
			if (config.includesOnly?.length && config.excludes?.length) console.warn(`${LIB_PREFIX} Both 'includesOnly' and 'excludes' were provided. 'includesOnly' takes precedence:`, config.includesOnly);
		}
		const includesSet = config?.includesOnly?.length ? new Set(config.includesOnly) : null;
		const excludesSet = config?.excludes?.length ? new Set(config.excludes) : null;
		for (const el of movies) {
			const type = getUserRatingType(el);
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
			id: getUserRatingId(el),
			title: getUserRatingTitle(el),
			year: getUserRatingYear(el),
			type,
			url: getUserRatingUrl(el, baseUrl),
			colorRating: getUserRatingColorRating(el),
			userDate: getUserRatingDate(el),
			userRating: getUserRating(el)
		};
	}
};
//#endregion
export { UserRatingsScraper };

//# sourceMappingURL=user-ratings.service.js.map