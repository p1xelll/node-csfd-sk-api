const require_vars = require("../vars.cjs");
const require_global_helper = require("./global.helper.cjs");
//#region src/helpers/creator.helper.ts
const getCreatorColorRating = (el) => {
	const classes = el?.classNames.split(" ") ?? [];
	const last = classes[classes.length - 1];
	return require_global_helper.parseColor(last);
};
const getCreatorId = (url) => {
	return url ? require_global_helper.parseIdFromUrl(url) : null;
};
const getCreatorName = (el) => {
	return (el?.querySelector("h1"))?.innerText?.trim() ?? null;
};
const getCreatorBirthdayInfo = (el) => {
	const infoBlock = el?.querySelector(".creator-profile-details p");
	const text = infoBlock?.innerHTML.trim();
	const birthPlaceRow = infoBlock?.querySelector(".info-place")?.innerText.trim();
	const ageRow = infoBlock?.querySelector(".info")?.innerText.trim();
	let birthday = null;
	if (text) {
		const birthdayRow = text.split("\n").find((x) => x.includes("nar."));
		birthday = birthdayRow ? require_global_helper.parseDate(parseBirthday(birthdayRow)) : null;
	}
	const age = ageRow ? +parseAge(ageRow) : null;
	const birthPlace = birthPlaceRow ? parseBirthPlace(birthPlaceRow) : "";
	return {
		birthday,
		age,
		birthPlace
	};
};
const getCreatorBio = (el) => {
	return (el?.querySelector(".article-content p"))?.text?.trim().split("\n")[0]?.trim() || null;
};
const getCreatorPhoto = (el) => {
	const src = el?.querySelector("img")?.getAttribute("src");
	return src ? require_global_helper.addProtocol(src) : null;
};
const parseBirthday = (text) => text.replace(/nar\./g, "").trim();
const parseAge = (text) => {
	const digits = text.replace(/[^\d]/g, "");
	return digits ? Number(digits) : null;
};
const parseBirthPlace = (text) => text.trim().replace(/<br>/g, "").trim();
const getCreatorFilms = (el, options) => {
	const filmNodes = el?.querySelector(".updated-box")?.querySelectorAll("table tr") ?? [];
	let yearCache = null;
	const baseUrl = require_vars.getBaseUrl(options?.domain, options?.language);
	return filmNodes.map((filmNode) => {
		const href = filmNode.querySelector("td.name .film-title-name")?.attributes?.href;
		const id = getCreatorId(href);
		const title = filmNode.querySelector(".name")?.text?.trim();
		const yearText = filmNode.querySelector(".year")?.text?.trim();
		const year = yearText ? +yearText : null;
		const colorRating = getCreatorColorRating(filmNode.querySelector(".name .icon"));
		if (typeof year === "number" && !isNaN(year)) yearCache = +year;
		const finalYear = year ?? yearCache;
		if (id != null && title && finalYear != null) return {
			id,
			title,
			year: finalYear,
			colorRating,
			url: href ? href.startsWith("/") ? `${baseUrl}${href}` : href : null
		};
		return null;
	}).filter(Boolean);
};
//#endregion
exports.getCreatorBio = getCreatorBio;
exports.getCreatorBirthdayInfo = getCreatorBirthdayInfo;
exports.getCreatorFilms = getCreatorFilms;
exports.getCreatorName = getCreatorName;
exports.getCreatorPhoto = getCreatorPhoto;

//# sourceMappingURL=creator.helper.cjs.map