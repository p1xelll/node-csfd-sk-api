const require_global_helper = require("./global.helper.cjs");
//#region src/helpers/movie.helper.ts
const CREATOR_LABELS = {
	en: {
		directors: "Directed by",
		writers: "Screenplay",
		cinematography: "Cinematography",
		music: "Composer",
		actors: "Cast",
		basedOn: "Based on",
		producers: "Produced by",
		filmEditing: "Editing",
		costumeDesign: "Costumes",
		productionDesign: "Production design",
		casting: "Casting",
		sound: "Sound",
		makeup: "Make-up"
	},
	cs: {
		directors: "Režie",
		writers: "Scénář",
		cinematography: "Kamera",
		music: "Hudba",
		actors: "Hrají",
		basedOn: "Předloha",
		producers: "Produkce",
		filmEditing: "Střih",
		costumeDesign: "Kostýmy",
		productionDesign: "Scénografie",
		casting: "Casting",
		sound: "Zvuk",
		makeup: "Masky"
	},
	sk: {
		directors: "Réžia",
		writers: "Scenár",
		cinematography: "Kamera",
		music: "Hudba",
		actors: "Hrajú",
		basedOn: "Predloha",
		producers: "Produkcia",
		filmEditing: "Strih",
		costumeDesign: "Kostýmy",
		productionDesign: "Scénografia",
		casting: "Casting",
		sound: "Zvuk",
		makeup: "Masky"
	}
};
/**
* Maps language-specific movie creator group labels.
* @param language - The language code (e.g., 'en', 'cs')
* @param key - The key of the creator group (e.g., 'directors', 'writers')
* @returns The localized label for the creator group
*/
const getLocalizedCreatorLabel = (language, key) => {
	return (CREATOR_LABELS[language || "cs"] || CREATOR_LABELS["cs"])[key];
};
const getSeriesAndSeasonTitle = (el) => {
	const titleElement = el.querySelector("h1");
	if (!titleElement) return {
		seriesName: null,
		seasonName: null
	};
	const fullText = titleElement.innerText.trim();
	if (fullText.includes(" - ")) {
		const [seriesName, seasonName] = fullText.split(" - ").map((part) => part.trim());
		return {
			seriesName,
			seasonName
		};
	}
	return {
		seriesName: fullText,
		seasonName: null
	};
};
const getMovieTitle = (el) => {
	return el.querySelector("h1").innerText.split(`(`)[0].trim();
};
const getMovieGenres = (el) => {
	const genresNode = el.querySelector(".genres");
	if (!genresNode) return [];
	return genresNode.childNodes.map((n) => n.textContent.trim()).filter((x) => x.length > 0);
};
const getMovieOrigins = (el) => {
	const originNode = el.querySelector(".origin");
	if (!originNode) return [];
	return (originNode.childNodes[0]?.text || "").split("/").map((x) => x.trim()).filter((x) => x);
};
const getMovieColorRating = (bodyClasses) => {
	return require_global_helper.getColor(bodyClasses[1]);
};
const getMovieRating = (el) => {
	const rating = (el.querySelector(".film-rating-average")?.textContent)?.replace(/%/g, "")?.trim();
	const ratingInt = parseInt(rating);
	if (Number.isInteger(ratingInt)) return ratingInt;
	else return null;
};
const getMovieRatingCount = (el) => {
	const ratingCountRaw = el.querySelector(".ratings-list .counter")?.textContent;
	if (!ratingCountRaw) return null;
	const countString = ratingCountRaw.replace(/[^\d]/g, "");
	const ratingCount = parseInt(countString, 10);
	if (Number.isInteger(ratingCount)) return ratingCount;
	else return null;
};
const getMovieYear = (jsonLd) => {
	if (jsonLd && jsonLd.dateCreated) return +jsonLd.dateCreated;
	return null;
};
const getMovieDuration = (jsonLd, el) => {
	if (jsonLd && jsonLd.duration) try {
		return require_global_helper.parseISO8601Duration(jsonLd.duration);
	} catch (e) {}
	try {
		const originText = el.querySelector(".origin")?.textContent;
		if (originText) {
			const match = originText.match(/(?:(\d+)\s*h)?\s*(\d+)\s*min/);
			if (match) {
				const hours = parseInt(match[1] || "0", 10);
				const minutes = parseInt(match[2] || "0", 10);
				return hours * 60 + minutes;
			}
		}
	} catch (error) {
		return null;
	}
	return null;
};
const getMovieTitlesOther = (el) => {
	const namesNode = el.querySelectorAll(".film-names li");
	if (!namesNode.length) return [];
	return namesNode.map((el) => {
		const country = el.querySelector("img.flag").attributes.alt;
		const title = el.textContent.trim().split("\n")[0];
		if (country && title) return {
			country,
			title
		};
		else return null;
	}).filter((x) => x);
};
const getMoviePoster = (el) => {
	const poster = el.querySelector(".film-posters img");
	if (poster) if (poster.classNames?.includes("empty-image")) return null;
	else return require_global_helper.addProtocol(poster.attributes.src.split("?")[0].replace(/\/w140\//, "/w1080/"));
	else return null;
};
const getMovieRandomPhoto = (el) => {
	const image = el.querySelector(".gallery-item picture img")?.attributes?.src;
	if (image) return image.replace(/\/w663\//, "/w1326/");
	else return null;
};
const getMovieTrivia = (el) => {
	const triviaNodes = el.querySelectorAll(".article-trivia ul li");
	if (triviaNodes?.length) return triviaNodes.map((node) => node.textContent.trim().replace(/(\r\n|\n|\r|\t)/gm, ""));
	else return null;
};
const getMovieDescriptions = (el) => {
	return el.querySelectorAll(".body--plots .plot-full p, .body--plots .plots .plots-item p").map((movie) => movie.textContent?.trim().replace(/(\r\n|\n|\r|\t)/gm, ""));
};
const parseMoviePeople = (el, baseUrl) => {
	return el.querySelectorAll("a").filter((x) => x.classNames.length === 0).map((person) => {
		const href = person.attributes.href;
		return {
			id: require_global_helper.parseIdFromUrl(href),
			name: person.innerText.trim(),
			url: href.startsWith("/") ? `${baseUrl}${href}` : href
		};
	});
};
const getMovieCreators = (el, options, baseUrl) => {
	const creators = {
		directors: [],
		writers: [],
		cinematography: [],
		music: [],
		actors: [],
		basedOn: [],
		producers: [],
		filmEditing: [],
		costumeDesign: [],
		productionDesign: [],
		sound: []
	};
	const groups = el.querySelectorAll(".creators h4");
	const localizedLabels = [
		"directors",
		"writers",
		"cinematography",
		"music",
		"actors",
		"basedOn",
		"producers",
		"filmEditing",
		"costumeDesign",
		"productionDesign",
		"sound"
	].map((key) => ({
		key,
		label: getLocalizedCreatorLabel(options?.language, key)
	}));
	const urlBase = baseUrl || "https://www.csfd.cz";
	for (const group of groups) {
		const text = group.textContent.trim();
		for (const { key, label } of localizedLabels) if (text.includes(label)) {
			if (group.parentNode) creators[key] = parseMoviePeople(group.parentNode, urlBase);
			break;
		}
	}
	return creators;
};
const getSeasonsOrEpisodes = (el, baseUrl) => {
	const childrenList = el.querySelector(".film-episodes-list");
	if (!childrenList) return null;
	const childrenNodes = childrenList.querySelectorAll(".film-title-inline");
	if (!childrenNodes?.length) return [];
	const urlBase = baseUrl || "https://www.csfd.cz";
	return childrenNodes.map((season) => {
		const nameContainer = season.querySelector(".film-title-name");
		const infoContainer = season.querySelector(".info");
		const href = nameContainer?.getAttribute("href");
		const url = href ? href.startsWith("/") ? `${urlBase}${href}` : href : null;
		return {
			id: require_global_helper.parseLastIdFromUrl(href || ""),
			title: nameContainer?.textContent?.trim() || null,
			url,
			info: infoContainer?.textContent?.replace(/[{()}]/g, "").trim() || null
		};
	});
};
const getEpisodeCode = (el) => {
	const filmHeaderName = el.querySelector(".film-header-name h1");
	if (!filmHeaderName) return null;
	const match = (filmHeaderName.textContent?.trim() || "").match(/\(([^)]+)\)/);
	return match ? match[1] : null;
};
const detectSeasonOrEpisodeListType = (el) => {
	const episodesList = el.querySelector(".film-episodes-list");
	if (!episodesList) return null;
	const headerText = (episodesList.closest(".updated-box") || episodesList.closest("section") || el).querySelector(".updated-box-header h3")?.textContent?.trim() ?? "";
	if (headerText.includes("Séri") || headerText.includes("Séria")) return "seasons";
	if (headerText.includes("Epizod") || headerText.includes("Epizódy")) return "episodes";
	return null;
};
const getSeasonOrEpisodeParent = (el, baseUrl) => {
	let parents = el.querySelectorAll(".film-series-content h2 a");
	if (parents.length === 0) parents = el.querySelectorAll(".film-header-name h1 a");
	if (parents.length === 0) return null;
	const [parentSeries, parentSeason] = parents;
	const seriesId = require_global_helper.parseIdFromUrl(parentSeries?.getAttribute("href"));
	const seasonId = require_global_helper.parseLastIdFromUrl(parentSeason?.getAttribute("href") || "");
	const seriesTitle = parentSeries?.textContent?.trim() || null;
	const seasonTitle = parentSeason?.textContent?.trim() || null;
	const series = seriesId && seriesTitle ? {
		id: seriesId,
		title: seriesTitle
	} : null;
	const season = seasonId && seasonTitle ? {
		id: seasonId,
		title: seasonTitle
	} : null;
	if (!series && !season) return null;
	return {
		series,
		season
	};
};
const getMovieType = (el) => {
	return require_global_helper.parseFilmType(el.querySelector(".film-header-name .type")?.innerText?.replace(/[{()}]/g, "").split("\n")[0].trim() || "film");
};
const getMovieVods = (el) => {
	let vods = [];
	if (el) vods = el.querySelectorAll(".box-film-vod .vod-badge-link").map((btn) => {
		return {
			title: btn.textContent.trim(),
			url: btn.attributes.href
		};
	});
	return vods.length ? vods : [];
};
const getBoxContent = (el, boxCz, boxSk) => {
	return el.querySelectorAll("section .updated-box-header").find((header) => {
		const text = header.querySelector("h3")?.textContent.trim() || header.querySelector("h2")?.textContent.trim() || "";
		return text === boxCz || text === boxSk;
	})?.parentNode;
};
const getMovieBoxMovies = (el, boxName, baseUrl) => {
	const movieListItem = [];
	const labels = {
		Související: {
			cz: "Související",
			sk: "Súvisiace"
		},
		Podobné: {
			cz: "Podobné",
			sk: "Podobné"
		}
	}[boxName] || {
		cz: boxName,
		sk: boxName
	};
	const movieTitleNodes = getBoxContent(el, labels.cz, labels.sk)?.querySelectorAll(".article-header .film-title-name");
	const urlBase = baseUrl || "https://www.csfd.cz";
	if (movieTitleNodes?.length) for (const item of movieTitleNodes) {
		const href = item.attributes.href;
		movieListItem.push({
			id: require_global_helper.parseIdFromUrl(href),
			title: item.textContent.trim(),
			url: href.startsWith("/") ? `${urlBase}${href}` : href
		});
	}
	return movieListItem;
};
const getMoviePremieres = (el) => {
	const premiereNodes = el.querySelectorAll(".box-premieres li");
	const premiere = [];
	for (const premiereNode of premiereNodes) {
		const title = premiereNode.querySelector("p + span").attributes.title;
		if (title) {
			const [dateRaw, ...company] = title?.split(" ");
			const date = require_global_helper.parseDate(dateRaw);
			if (date) premiere.push({
				country: premiereNode.querySelector(".flag")?.attributes.title || null,
				format: premiereNode.querySelector("p").textContent.trim()?.split(" od")[0],
				date,
				company: company.join(" ")
			});
		}
	}
	return premiere;
};
const getMovieTags = (el) => {
	return el.querySelectorAll(".updated-box-content-tags a").map((tag) => tag.textContent.trim());
};
//#endregion
exports.detectSeasonOrEpisodeListType = detectSeasonOrEpisodeListType;
exports.getEpisodeCode = getEpisodeCode;
exports.getMovieBoxMovies = getMovieBoxMovies;
exports.getMovieColorRating = getMovieColorRating;
exports.getMovieCreators = getMovieCreators;
exports.getMovieDescriptions = getMovieDescriptions;
exports.getMovieDuration = getMovieDuration;
exports.getMovieGenres = getMovieGenres;
exports.getMovieOrigins = getMovieOrigins;
exports.getMoviePoster = getMoviePoster;
exports.getMoviePremieres = getMoviePremieres;
exports.getMovieRandomPhoto = getMovieRandomPhoto;
exports.getMovieRating = getMovieRating;
exports.getMovieRatingCount = getMovieRatingCount;
exports.getMovieTags = getMovieTags;
exports.getMovieTitle = getMovieTitle;
exports.getMovieTitlesOther = getMovieTitlesOther;
exports.getMovieTrivia = getMovieTrivia;
exports.getMovieType = getMovieType;
exports.getMovieVods = getMovieVods;
exports.getMovieYear = getMovieYear;
exports.getSeasonOrEpisodeParent = getSeasonOrEpisodeParent;
exports.getSeasonsOrEpisodes = getSeasonsOrEpisodes;
exports.getSeriesAndSeasonTitle = getSeriesAndSeasonTitle;

//# sourceMappingURL=movie.helper.cjs.map