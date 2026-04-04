//#region src/vars.ts
const LIB_PREFIX = "[node-csfd-api]";
const DOMAIN_MAP = {
	cz: "https://www.csfd.cz",
	sk: "https://www.csfd.sk"
};
const LANGUAGE_PATH_MAP = {
	cs: "",
	en: "/en",
	sk: "/sk"
};
let BASE_DOMAIN = "cz";
/**
* Gets the base URL for the specified domain and language.
* For .sk domain, language paths are not supported (csfd.sk is Slovak only).
* For .cz domain, language paths are supported (/en, /sk).
*/
const getBaseUrl = (domain, language) => {
	const dom = domain ?? BASE_DOMAIN;
	const baseUrl = DOMAIN_MAP[dom];
	if (dom === "cz" && language) return `${baseUrl}${LANGUAGE_PATH_MAP[language] || ""}`;
	return baseUrl;
};
const userUrl = (user, options) => `${getBaseUrl(options?.domain, options?.language)}/uzivatel/${encodeURIComponent(user)}`;
const userRatingsUrl = (user, page, options = {}) => `${userUrl(user, options)}/hodnoceni/${page ? "?page=" + page : ""}`;
const userReviewsUrl = (user, page, options = {}) => `${userUrl(user, options)}/recenze/${page ? "?page=" + page : ""}`;
const movieUrl = (movie, options) => `${getBaseUrl(options?.domain, options?.language)}/film/${encodeURIComponent(movie)}/prehled/`;
const creatorUrl = (creator, options) => `${getBaseUrl(options?.domain, options?.language)}/tvurce/${encodeURIComponent(creator)}`;
const cinemasUrl = (district, period, options) => `${getBaseUrl(options?.domain, options?.language)}/kino/?period=${period}&district=${district}`;
const searchUrl = (text, options) => `${getBaseUrl(options?.domain, options?.language)}/hledat/?q=${encodeURIComponent(text)}`;
//#endregion
exports.LIB_PREFIX = LIB_PREFIX;
exports.cinemasUrl = cinemasUrl;
exports.creatorUrl = creatorUrl;
exports.getBaseUrl = getBaseUrl;
exports.movieUrl = movieUrl;
exports.searchUrl = searchUrl;
exports.userRatingsUrl = userRatingsUrl;
exports.userReviewsUrl = userReviewsUrl;

//# sourceMappingURL=vars.cjs.map