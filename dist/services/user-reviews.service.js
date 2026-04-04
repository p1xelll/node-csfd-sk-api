import { LIB_PREFIX, getBaseUrl, userReviewsUrl } from "../vars.js";
import { fetchPage } from "../fetchers/index.js";
import { sleep } from "../helpers/global.helper.js";
import { getUserReviewColorRating, getUserReviewDate, getUserReviewId, getUserReviewPoster, getUserReviewRating, getUserReviewText, getUserReviewTitle, getUserReviewType, getUserReviewUrl, getUserReviewYear } from "../helpers/user-reviews.helper.js";
import { parse } from "node-html-parser";
//#region src/services/user-reviews.service.ts
var UserReviewsScraper = class {
	async userReviews(user, config, options) {
		let allReviews = [];
		const pageToFetch = config?.page || 1;
		const items = parse(await fetchPage(userReviewsUrl(user, pageToFetch > 1 ? pageToFetch : void 0, {
			language: options?.language,
			domain: options?.domain
		}), { ...options?.request }));
		const reviews = items.querySelectorAll(".user-tab-reviews .article");
		const pagesNode = items.querySelector(".pagination");
		const pages = +pagesNode?.childNodes[pagesNode.childNodes.length - 4].rawText || 1;
		const baseUrl = getBaseUrl(options?.domain, options?.language);
		allReviews = this.getPage(config, reviews, baseUrl);
		if (config?.allPages) {
			for (let i = 2; i <= pages; i++) {
				config.onProgress?.(i, pages);
				const reviews = parse(await fetchPage(userReviewsUrl(user, i, {
					language: options?.language,
					domain: options?.domain
				}), { ...options?.request })).querySelectorAll(".user-tab-reviews .article");
				allReviews = [...allReviews, ...this.getPage(config, reviews, baseUrl)];
				if (config.allPagesDelay) await sleep(config.allPagesDelay);
			}
			return allReviews;
		}
		return allReviews;
	}
	getPage(config, reviews, baseUrl) {
		const films = [];
		if (config) {
			if (config.includesOnly?.length && config.excludes?.length) console.warn(`${LIB_PREFIX} Both 'includesOnly' and 'excludes' were provided. 'includesOnly' takes precedence:`, config.includesOnly);
		}
		const includesSet = config?.includesOnly?.length ? new Set(config.includesOnly) : null;
		const excludesSet = config?.excludes?.length ? new Set(config.excludes) : null;
		for (const el of reviews) {
			const type = getUserReviewType(el);
			if (includesSet) {
				if (includesSet.has(type)) films.push(this.buildUserReviews(el, type, baseUrl));
			} else if (excludesSet) {
				if (!excludesSet.has(type)) films.push(this.buildUserReviews(el, type, baseUrl));
			} else films.push(this.buildUserReviews(el, type, baseUrl));
		}
		return films;
	}
	buildUserReviews(el, type, baseUrl) {
		return {
			id: getUserReviewId(el),
			title: getUserReviewTitle(el),
			year: getUserReviewYear(el),
			type,
			url: getUserReviewUrl(el, baseUrl),
			colorRating: getUserReviewColorRating(el),
			userDate: getUserReviewDate(el),
			userRating: getUserReviewRating(el),
			text: getUserReviewText(el),
			poster: getUserReviewPoster(el)
		};
	}
};
//#endregion
export { UserReviewsScraper };

//# sourceMappingURL=user-reviews.service.js.map