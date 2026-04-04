const require_vars = require("../vars.cjs");
const require_index = require("../fetchers/index.cjs");
const require_global_helper = require("../helpers/global.helper.cjs");
const require_search_creator_helper = require("../helpers/search-creator.helper.cjs");
const require_search_user_helper = require("../helpers/search-user.helper.cjs");
const require_search_helper = require("../helpers/search.helper.cjs");
let node_html_parser = require("node-html-parser");
//#region src/services/search.service.ts
var SearchScraper = class {
	async search(text, options) {
		const html = (0, node_html_parser.parse)(await require_index.fetchPage(require_vars.searchUrl(text, {
			language: options?.language,
			domain: options?.domain
		}), { ...options?.request }));
		const moviesNode = html.querySelectorAll(".main-movies article");
		const usersNode = html.querySelectorAll(".main-users article");
		const tvSeriesNode = html.querySelectorAll(".main-series article");
		const creatorsNode = html.querySelectorAll(".main-authors article");
		return this.parseSearch(moviesNode, usersNode, tvSeriesNode, creatorsNode, options);
	}
	parseSearch(moviesNode, usersNode, tvSeriesNode, creatorsNode, options) {
		const baseUrl = require_vars.getBaseUrl(options?.domain, options?.language);
		const movies = [];
		const users = [];
		const tvSeries = [];
		const creators = [];
		const movieMapper = (m) => {
			const url = require_search_helper.getSearchUrl(m);
			return {
				id: require_global_helper.parseIdFromUrl(url),
				title: require_search_helper.getSearchTitle(m),
				year: require_search_helper.getSearchYear(m),
				url: `${baseUrl}${url}`,
				type: require_search_helper.getSearchType(m),
				colorRating: require_search_helper.getSearchColorRating(m),
				poster: require_search_helper.getSearchPoster(m),
				origins: require_search_helper.getSearchOrigins(m),
				creators: {
					directors: require_search_helper.parseSearchPeople(m, "directors", baseUrl),
					actors: require_search_helper.parseSearchPeople(m, "actors", baseUrl)
				}
			};
		};
		const userMapper = (m) => {
			const url = require_search_user_helper.getUserUrl(m);
			return {
				id: require_global_helper.parseIdFromUrl(url),
				user: require_search_user_helper.getUser(m),
				userRealName: require_search_user_helper.getUserRealName(m),
				avatar: require_search_user_helper.getAvatar(m),
				url: `${baseUrl}${url}`
			};
		};
		const creatorMapper = (m) => {
			const url = require_search_creator_helper.getCreatorUrl(m);
			return {
				id: require_global_helper.parseIdFromUrl(url),
				name: require_search_creator_helper.getCreatorName(m),
				image: require_search_creator_helper.getCreatorImage(m),
				url: `${baseUrl}${url}`
			};
		};
		movies.push(...moviesNode.map(movieMapper));
		users.push(...usersNode.map(userMapper));
		tvSeries.push(...tvSeriesNode.map(movieMapper));
		creators.push(...creatorsNode.map(creatorMapper));
		return {
			movies,
			users,
			tvSeries,
			creators
		};
	}
};
//#endregion
exports.SearchScraper = SearchScraper;

//# sourceMappingURL=search.service.cjs.map