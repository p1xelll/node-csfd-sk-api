import { addProtocol, parseColor, parseFilmType, parseIdFromUrl } from "./global.helper.js";
//#region src/helpers/search.helper.ts
const getSearchType = (el) => {
	const type = el.querySelectorAll(".film-title-info .info")[1];
	return parseFilmType(type?.innerText?.replace(/[{()}]/g, "")?.trim() || "film");
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
	return parseColor(el.querySelector(".article-header i.icon").classNames.split(" ").pop());
};
const getSearchPoster = (el) => {
	const image = el.querySelector("img").attributes.src;
	return addProtocol(image);
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
			id: parseIdFromUrl(href),
			name: person.innerText.trim(),
			url: href.startsWith("/") ? `${baseUrl}${href}` : href
		};
	});
	else return [];
};
//#endregion
export { getSearchColorRating, getSearchOrigins, getSearchPoster, getSearchTitle, getSearchType, getSearchUrl, getSearchYear, parseSearchPeople };

//# sourceMappingURL=search.helper.js.map