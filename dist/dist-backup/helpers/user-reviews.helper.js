import { parseColor, parseDate, parseFilmType, parseIdFromUrl } from "./global.helper.js";
//#region src/helpers/user-reviews.helper.ts
const getUserReviewId = (el) => {
	const url = el.querySelector(".film-title-name").attributes.href;
	return parseIdFromUrl(url);
};
const getUserReviewRating = (el) => {
	const ratingText = el.querySelector(".star-rating .stars").classNames.split(" ").pop();
	return ratingText.includes("stars-") ? +ratingText.split("-").pop() : 0;
};
const getUserReviewType = (el) => {
	const typeNode = el.querySelector(".film-title-info .info ~ .info");
	return parseFilmType(typeNode ? typeNode.text.slice(1, -1) : "film");
};
const getUserReviewTitle = (el) => {
	return el.querySelector(".film-title-name").text;
};
const getUserReviewYear = (el) => {
	const infoSpan = el.querySelector(".film-title-info .info");
	return infoSpan ? +infoSpan.text.replace(/[()]/g, "") || null : null;
};
const getUserReviewColorRating = (el) => {
	return parseColor(el.querySelector(".film-title-inline i.icon")?.classNames.split(" ").pop());
};
const getUserReviewDate = (el) => {
	return parseDate(el.querySelector(".article-header-date-content .info time").text.trim());
};
const getUserReviewUrl = (el, baseUrl) => {
	const url = el.querySelector(".film-title-name").attributes.href;
	return url.startsWith("/") ? `${baseUrl}${url}` : url;
};
const getUserReviewText = (el) => {
	return el.querySelector(".comment").text.trim();
};
const getUserReviewPoster = (el) => {
	const img = el.querySelector(".article-img img");
	const srcset = img?.attributes.srcset;
	if (srcset) {
		const poster3x = srcset.split(",").map((s) => s.trim()).find((s) => s.endsWith("3x"));
		if (poster3x) return `https:${poster3x.replace(/\s+3x$/, "").trim()}`;
	}
	const src = img?.attributes.src;
	return src ? `https:${src}` : null;
};
//#endregion
export { getUserReviewColorRating, getUserReviewDate, getUserReviewId, getUserReviewPoster, getUserReviewRating, getUserReviewText, getUserReviewTitle, getUserReviewType, getUserReviewUrl, getUserReviewYear };

//# sourceMappingURL=user-reviews.helper.js.map