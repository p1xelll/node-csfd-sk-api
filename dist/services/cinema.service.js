import { cinemasUrl } from "../vars.js";
import { fetchPage } from "../fetchers/index.js";
import { getCinemaCoords, getCinemaId, getCinemaUrl, getGroupedFilmsByDate, parseCinema } from "../helpers/cinema.helper.js";
import { parse } from "node-html-parser";
//#region src/services/cinema.service.ts
var CinemaScraper = class {
	async cinemas(district = 1, period = "today", options) {
		const contentNode = parse(await fetchPage(cinemasUrl(district, period, {
			language: options?.language,
			domain: options?.domain
		}), { ...options?.request })).querySelectorAll("#snippet--cinemas section[id*=\"cinema-\"]");
		return this.buildCinemas(contentNode);
	}
	buildCinemas(contentNode) {
		const cinemas = [];
		contentNode.forEach((x) => {
			const cinemaInfo = parseCinema(x);
			const cinema = {
				id: getCinemaId(x),
				name: cinemaInfo?.name,
				city: cinemaInfo?.city,
				url: getCinemaUrl(x),
				coords: getCinemaCoords(x),
				screenings: getGroupedFilmsByDate(x)
			};
			cinemas.push(cinema);
		});
		return cinemas;
	}
};
//#endregion
export { CinemaScraper };

//# sourceMappingURL=cinema.service.js.map