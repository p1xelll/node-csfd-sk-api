import { getBaseUrl, searchUrl } from "../vars.js";
import { fetchPage } from "../fetchers/index.js";
import { parseIdFromUrl } from "../helpers/global.helper.js";
import { getCreatorImage, getCreatorName, getCreatorUrl } from "../helpers/search-creator.helper.js";
import { getAvatar, getUser, getUserRealName, getUserUrl } from "../helpers/search-user.helper.js";
import { getSearchColorRating, getSearchOrigins, getSearchPoster, getSearchTitle, getSearchType, getSearchUrl, getSearchYear, parseSearchPeople } from "../helpers/search.helper.js";
import { parse } from "node-html-parser";
//#region src/services/search.service.ts
var SearchScraper = class {
	async search(text, options) {
		const html = parse(await fetchPage(searchUrl(text, {
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
		const baseUrl = getBaseUrl(options?.domain, options?.language);
		const movies = [];
		const users = [];
		const tvSeries = [];
		const creators = [];
		const movieMapper = (m) => {
			const url = getSearchUrl(m);
			return {
				id: parseIdFromUrl(url),
				title: getSearchTitle(m),
				year: getSearchYear(m),
				url: `${baseUrl}${url}`,
				type: getSearchType(m),
				colorRating: getSearchColorRating(m),
				poster: getSearchPoster(m),
				origins: getSearchOrigins(m),
				creators: {
					directors: parseSearchPeople(m, "directors", baseUrl),
					actors: parseSearchPeople(m, "actors", baseUrl)
				}
			};
		};
		const userMapper = (m) => {
			const url = getUserUrl(m);
			return {
				id: parseIdFromUrl(url),
				user: getUser(m),
				userRealName: getUserRealName(m),
				avatar: getAvatar(m),
				url: `${baseUrl}${url}`
			};
		};
		const creatorMapper = (m) => {
			const url = getCreatorUrl(m);
			return {
				id: parseIdFromUrl(url),
				name: getCreatorName(m),
				image: getCreatorImage(m),
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
export { SearchScraper };

//# sourceMappingURL=search.service.js.map