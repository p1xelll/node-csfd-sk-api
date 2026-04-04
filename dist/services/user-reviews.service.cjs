const require_vars = require("../vars.cjs");
const require_index = require("../fetchers/index.cjs");
const require_global_helper = require("../helpers/global.helper.cjs");
const require_user_reviews_helper = require("../helpers/user-reviews.helper.cjs");
let node_html_parser = require("node-html-parser");
//#region src/services/user-reviews.service.ts
var UserReviewsScraper = class {
	async userReviews(user, config, options) {
		let allReviews = [];
		const pageToFetch = config?.page || 1;
		const items = (0, node_html_parser.parse)(await require_index.fetchPage(require_vars.userReviewsUrl(user, pageToFetch > 1 ? pageToFetch : void 0, {
			language: options?.language,
			domain: options?.domain
		}), { ...options?.request }));
		const reviews = items.querySelectorAll(".user-tab-reviews .article");
		const pagesNode = items.querySelector(".pagination");
		const pages = +pagesNode?.childNodes[pagesNode.childNodes.length - 4].rawText || 1;
		const baseUrl = require_vars.getBaseUrl(options?.domain, options?.language);
		allReviews = this.getPage(config, reviews, baseUrl);
		if (config?.allPages) {
			for (let i = 2; i <= pages; i++) {
				config.onProgress?.(i, pages);
				const reviews = (0, node_html_parser.parse)(await require_index.fetchPage(require_vars.userReviewsUrl(user, i, {
					language: options?.language,
					domain: options?.domain
				}), { ...options?.request })).querySelectorAll(".user-tab-reviews .article");
				allReviews = [...allReviews, ...this.getPage(config, reviews, baseUrl)];
				if (config.allPagesDelay) await require_global_helper.sleep(config.allPagesDelay);
			}
			return allReviews;
		}
		return allReviews;
	}
	getPage(config, reviews, baseUrl) {
		const films = [];
		if (config) {
			if (config.includesOnly?.length && config.excludes?.length) console.warn(`${require_vars.LIB_PREFIX} Both 'includesOnly' and 'excludes' were provided. 'includesOnly' takes precedence:`, config.includesOnly);
		}
		const includesSet = config?.includesOnly?.length ? new Set(config.includesOnly) : null;
		const excludesSet = config?.excludes?.length ? new Set(config.excludes) : null;
		for (const el of reviews) {
			const type = require_user_reviews_helper.getUserReviewType(el);
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
			id: require_user_reviews_helper.getUserReviewId(el),
			title: require_user_reviews_helper.getUserReviewTitle(el),
			year: require_user_reviews_helper.getUserReviewYear(el),
			type,
			url: require_user_reviews_helper.getUserReviewUrl(el, baseUrl),
			colorRating: require_user_reviews_helper.getUserReviewColorRating(el),
			userDate: require_user_reviews_helper.getUserReviewDate(el),
			userRating: require_user_reviews_helper.getUserReviewRating(el),
			text: require_user_reviews_helper.getUserReviewText(el),
			poster: require_user_reviews_helper.getUserReviewPoster(el)
		};
	}
};
//#endregion
exports.UserReviewsScraper = UserReviewsScraper;

//# sourceMappingURL=user-reviews.service.cjs.map