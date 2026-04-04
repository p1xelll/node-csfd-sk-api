const require_vars = require("../vars.cjs");
const require_index = require("../fetchers/index.cjs");
const require_cinema_helper = require("../helpers/cinema.helper.cjs");
let node_html_parser = require("node-html-parser");
//#region src/services/cinema.service.ts
var CinemaScraper = class {
	async cinemas(district = 1, period = "today", options) {
		const contentNode = (0, node_html_parser.parse)(await require_index.fetchPage(require_vars.cinemasUrl(district, period, {
			language: options?.language,
			domain: options?.domain
		}), { ...options?.request })).querySelectorAll("#snippet--cinemas section[id*=\"cinema-\"]");
		return this.buildCinemas(contentNode);
	}
	buildCinemas(contentNode) {
		const cinemas = [];
		contentNode.forEach((x) => {
			const cinemaInfo = require_cinema_helper.parseCinema(x);
			const cinema = {
				id: require_cinema_helper.getCinemaId(x),
				name: cinemaInfo?.name,
				city: cinemaInfo?.city,
				url: require_cinema_helper.getCinemaUrl(x),
				coords: require_cinema_helper.getCinemaCoords(x),
				screenings: require_cinema_helper.getGroupedFilmsByDate(x)
			};
			cinemas.push(cinema);
		});
		return cinemas;
	}
};
//#endregion
exports.CinemaScraper = CinemaScraper;

//# sourceMappingURL=cinema.service.cjs.map