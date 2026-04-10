//#region src/helpers/global.helper.ts
const LANG_PREFIX_REGEX = /^[a-z]{2,3}$/;
const ISO8601_DURATION_REGEX = /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;
const parseIdFromUrl = (url) => {
	if (!url) return null;
	const parts = url.split("/");
	for (let i = parts.length - 1; i >= 0; i--) {
		const p = parts[i];
		if (/^\d+-/.test(p)) return +p.split("-")[0] || null;
	}
	return +parts[LANG_PREFIX_REGEX.test(parts[1]) ? 3 : 2]?.split("-")[0] || null;
};
const parseLastIdFromUrl = (url) => {
	if (url) return +(url?.split("/")[3])?.split("-")[0] || null;
	else return null;
};
const PAGE_COLORS = {
	"page-lightgrey": "unknown",
	"page-red": "good",
	"page-blue": "average",
	"page-grey": "bad"
};
const getColor = (cls) => {
	return PAGE_COLORS[cls] || "unknown";
};
const RATING_COLORS = {
	lightgrey: "unknown",
	red: "good",
	blue: "average",
	grey: "bad"
};
const parseColor = (quality) => {
	return RATING_COLORS[quality] || "unknown";
};
const FILM_TYPES = {
	"TV film": "tv-film",
	pořad: "tv-show",
	seriál: "series",
	"divadelní záznam": "theatrical",
	koncert: "concert",
	série: "season",
	"studentský film": "student-film",
	"amatérský film": "amateur-film",
	"hudební videoklip": "music-video",
	epizoda: "episode",
	"video kompilace": "video-compilation",
	film: "film"
};
const parseFilmType = (type) => {
	return FILM_TYPES[type] || "film";
};
const addProtocol = (url) => {
	return url.startsWith("//") ? "https:" + url : url;
};
const getDuration = (matches) => {
	return {
		sign: matches[1] === void 0 ? "+" : "-",
		years: matches[2] === void 0 ? 0 : matches[2],
		months: matches[3] === void 0 ? 0 : matches[3],
		weeks: matches[4] === void 0 ? 0 : matches[4],
		days: matches[5] === void 0 ? 0 : matches[5],
		hours: matches[6] === void 0 ? 0 : matches[6],
		minutes: matches[7] === void 0 ? 0 : matches[7],
		seconds: matches[8] === void 0 ? 0 : matches[8]
	};
};
const parseISO8601Duration = (iso) => {
	const duration = getDuration(iso.match(ISO8601_DURATION_REGEX));
	return +duration.hours * 60 + +duration.minutes;
};
/**
* Parses a date string into a standardized YYYY-MM-DD format.
* Supports:
* - D.M.YYYY
* - DD.MM.YYYY
* - D. M. YYYY
* - MM/DD/YYYY
* - YYYY
*/
const parseDate = (date) => {
	if (!date) return null;
	const cleanDate = date.trim();
	const dateMatch = cleanDate.match(/^(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})$/);
	if (dateMatch) {
		const day = dateMatch[1].padStart(2, "0");
		const month = dateMatch[2].padStart(2, "0");
		return `${dateMatch[3]}-${month}-${day}`;
	}
	const slashMatch = cleanDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
	if (slashMatch) {
		const month = slashMatch[1].padStart(2, "0");
		const day = slashMatch[2].padStart(2, "0");
		return `${slashMatch[3]}-${month}-${day}`;
	}
	const yearMatch = cleanDate.match(/^(\d{4})$/);
	if (yearMatch) return `${yearMatch[1]}-01-01`;
	return null;
};
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
//#endregion
exports.addProtocol = addProtocol;
exports.getColor = getColor;
exports.parseColor = parseColor;
exports.parseDate = parseDate;
exports.parseFilmType = parseFilmType;
exports.parseISO8601Duration = parseISO8601Duration;
exports.parseIdFromUrl = parseIdFromUrl;
exports.parseLastIdFromUrl = parseLastIdFromUrl;
exports.sleep = sleep;

//# sourceMappingURL=global.helper.cjs.map