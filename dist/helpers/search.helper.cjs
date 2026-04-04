const require_global_helper = require("./global.helper.cjs");
//#region src/helpers/search.helper.ts
const getSearchType = (el) => {
	const type = el.querySelectorAll(".film-title-info .info")[1];
	return require_global_helper.parseFilmType(type?.innerText?.replace(/[{()}]/g, "")?.trim() || "film");
};
const getSearchTitle = (el) => {
	return el.querySelector(".film-title-name").text;
};
const getSearchYear = (el) => {
	return +el.querySelector(".film-title-info .info")?.innerText.replace(/[{()}]/g, "");
};
const getSearchUrl = (el) => {
	return el.querySelector(".film-title-name").attributes.href;
};
const getSearchColorRating = (el) => {
	return require_global_helper.parseColor(el.querySelector(".article-header i.icon").classNames.split(" ").pop());
};
const getSearchPoster = (el) => {
	const image = el.querySelector("img").attributes.src;
	return require_global_helper.addProtocol(image);
};
const getSearchOrigins = (el) => {
	const originsRaw = el.querySelector(".article-content p .info")?.text;
	if (!originsRaw) return [];
	return (originsRaw?.split(", ")?.[0])?.split("/").map((country) => country.trim());
};
const parseSearchPeople = (el, type, baseUrl) => {
	let whoCz;
	let whoSk;
	if (type === "directors") {
		whoCz = "Režie:";
		whoSk = "Réžia:";
	}
	if (type === "actors") {
		whoCz = "Hrají:";
		whoSk = "Hrajú:";
	}
	const peopleNode = Array.from(el && el.querySelectorAll(".article-content p")).find((el) => el.textContent.includes(whoCz) || el.textContent.includes(whoSk));
	if (peopleNode) return Array.from(peopleNode.querySelectorAll("a")).map((person) => {
		const href = person.attributes.href;
		return {
			id: require_global_helper.parseIdFromUrl(href),
			name: person.innerText.trim(),
			url: href.startsWith("/") ? `${baseUrl}${href}` : href
		};
	});
	else return [];
};
//#endregion
exports.getSearchColorRating = getSearchColorRating;
exports.getSearchOrigins = getSearchOrigins;
exports.getSearchPoster = getSearchPoster;
exports.getSearchTitle = getSearchTitle;
exports.getSearchType = getSearchType;
exports.getSearchUrl = getSearchUrl;
exports.getSearchYear = getSearchYear;
exports.parseSearchPeople = parseSearchPeople;

//# sourceMappingURL=search.helper.cjs.map