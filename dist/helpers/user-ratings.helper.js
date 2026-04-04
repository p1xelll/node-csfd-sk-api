import { parseColor, parseDate, parseFilmType, parseIdFromUrl } from "./global.helper.js";
//#region src/helpers/user-ratings.helper.ts
const getUserRatingId = (el) => {
	const url = el.querySelector("td.name .film-title-name").attributes.href;
	return parseIdFromUrl(url);
};
const getUserRating = (el) => {
	const ratingText = el.querySelector("td.star-rating-only .stars").classNames.split(" ").pop();
	return ratingText.includes("stars-") ? +ratingText.split("-").pop() : 0;
};
const getUserRatingType = (el) => {
	const typeNode = el.querySelector("td.name .film-title-info .info ~ .info");
	return parseFilmType(typeNode ? typeNode.text : "film");
};
const getUserRatingTitle = (el) => {
	return el.querySelector("td.name .film-title-name").text;
};
const getUserRatingYear = (el) => {
	const yearNode = el.querySelector("td.name .film-title-info .info");
	return yearNode ? +yearNode.text || null : null;
};
const getUserRatingColorRating = (el) => {
	return parseColor(el.querySelector("td.name .icon").classNames.split(" ").pop());
};
const getUserRatingDate = (el) => {
	return parseDate(el.querySelector("td.date-only").text.trim());
};
const getUserRatingUrl = (el, baseUrl) => {
	const url = el.querySelector("td.name .film-title-name").attributes.href;
	return url.startsWith("/") ? `${baseUrl}${url}` : url;
};
//#endregion
export { getUserRating, getUserRatingColorRating, getUserRatingDate, getUserRatingId, getUserRatingTitle, getUserRatingType, getUserRatingUrl, getUserRatingYear };

//# sourceMappingURL=user-ratings.helper.js.map