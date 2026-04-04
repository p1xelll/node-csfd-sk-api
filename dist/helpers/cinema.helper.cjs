const require_global_helper = require("./global.helper.cjs");
//#region src/helpers/cinema.helper.ts
const getCinemaColorRating = (el) => {
	const classes = el?.classNames.split(" ") ?? [];
	const last = classes.length ? classes[classes.length - 1] : void 0;
	return last ? require_global_helper.parseColor(last) : "unknown";
};
const getCinemaId = (el) => {
	return +el?.id?.split("-")[1];
};
const getCinemaUrlId = (url) => {
	if (!url) return null;
	return require_global_helper.parseIdFromUrl(url);
};
const getCinemaCoords = (el) => {
	if (!el) return null;
	const linkMapsEl = el.querySelector("a[href*=\"q=\"]");
	if (!linkMapsEl) return null;
	const [_, latLng] = linkMapsEl.getAttribute("href").split("q=");
	const coords = latLng.split(",");
	if (coords.length !== 2) return null;
	const lat = Number(coords[0]);
	const lng = Number(coords[1]);
	if (Number.isFinite(lat) && Number.isFinite(lng)) return {
		lat,
		lng
	};
	return null;
};
const getCinemaUrl = (el) => {
	if (!el) return "";
	return el.querySelector(".cinema-logo a")?.attributes.href ?? "";
};
const parseCinema = (el) => {
	const [city, name] = el.querySelector("header h2").innerText.trim().split(" - ");
	return {
		city,
		name
	};
};
const getGroupedFilmsByDate = (el) => {
	const divs = el.querySelectorAll(":scope > div");
	return divs.map((_, index) => index).filter((index) => index % 2 === 0).map((index) => {
		const [date, films] = divs.slice(index, index + 2);
		return {
			date: date?.firstChild?.textContent?.trim() ?? null,
			films: getCinemaFilms("", films)
		};
	});
};
const getCinemaFilms = (date, el) => {
	return el.querySelectorAll(".cinema-table tr").map((filmNode) => {
		const url = filmNode.querySelector("td.name h3 a")?.attributes.href;
		const id = url ? getCinemaUrlId(url) : null;
		const title = filmNode.querySelector(".name h3")?.text.trim();
		const colorRating = getCinemaColorRating(filmNode.querySelector(".name .icon"));
		const showTimes = filmNode.querySelectorAll(".td-time")?.map((x) => x.textContent.trim());
		const meta = filmNode.querySelectorAll(".td-title span")?.map((x) => x.text.trim());
		return {
			id,
			title,
			url,
			colorRating,
			showTimes,
			meta: parseMeta(meta)
		};
	});
};
const parseMeta = (meta) => {
	const metaConvert = [];
	for (const element of meta) if (element === "T") metaConvert.push("subtitles");
	else if (element === "D") metaConvert.push("dubbing");
	else metaConvert.push(element);
	return metaConvert;
};
//#endregion
exports.getCinemaCoords = getCinemaCoords;
exports.getCinemaId = getCinemaId;
exports.getCinemaUrl = getCinemaUrl;
exports.getGroupedFilmsByDate = getGroupedFilmsByDate;
exports.parseCinema = parseCinema;

//# sourceMappingURL=cinema.helper.cjs.map