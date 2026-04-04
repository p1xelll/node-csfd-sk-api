const require_global_helper = require("./global.helper.cjs");
//#region src/helpers/user-ratings.helper.ts
const getUserRatingId = (el) => {
	const url = el.querySelector("td.name .film-title-name").attributes.href;
	return require_global_helper.parseIdFromUrl(url);
};
const getUserRating = (el) => {
	const ratingText = el.querySelector("td.star-rating-only .stars").classNames.split(" ").pop();
	return ratingText.includes("stars-") ? +ratingText.split("-").pop() : 0;
};
const getUserRatingType = (el) => {
	const typeNode = el.querySelector("td.name .film-title-info .info ~ .info");
	return require_global_helper.parseFilmType(typeNode ? typeNode.text : "film");
};
const getUserRatingTitle = (el) => {
	return el.querySelector("td.name .film-title-name").text;
};
const getUserRatingYear = (el) => {
	const yearNode = el.querySelector("td.name .film-title-info .info");
	return yearNode ? +yearNode.text || null : null;
};
const getUserRatingColorRating = (el) => {
	return require_global_helper.parseColor(el.querySelector("td.name .icon").classNames.split(" ").pop());
};
const getUserRatingDate = (el) => {
	return require_global_helper.parseDate(el.querySelector("td.date-only").text.trim());
};
const getUserRatingUrl = (el, baseUrl) => {
	const url = el.querySelector("td.name .film-title-name").attributes.href;
	return url.startsWith("/") ? `${baseUrl}${url}` : url;
};
//#endregion
exports.getUserRating = getUserRating;
exports.getUserRatingColorRating = getUserRatingColorRating;
exports.getUserRatingDate = getUserRatingDate;
exports.getUserRatingId = getUserRatingId;
exports.getUserRatingTitle = getUserRatingTitle;
exports.getUserRatingType = getUserRatingType;
exports.getUserRatingUrl = getUserRatingUrl;
exports.getUserRatingYear = getUserRatingYear;

//# sourceMappingURL=user-ratings.helper.cjs.map