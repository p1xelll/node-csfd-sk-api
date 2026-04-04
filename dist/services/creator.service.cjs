const require_vars = require("../vars.cjs");
const require_index = require("../fetchers/index.cjs");
const require_creator_helper = require("../helpers/creator.helper.cjs");
let node_html_parser = require("node-html-parser");
//#region src/services/creator.service.ts
var CreatorScraper = class {
	async creator(creatorId, options) {
		const id = Number(creatorId);
		if (isNaN(id)) throw new Error("node-csfd-api: creatorId must be a valid number");
		const creatorHtml = (0, node_html_parser.parse)(await require_index.fetchPage(require_vars.creatorUrl(id, {
			language: options?.language,
			domain: options?.domain
		}), { ...options?.request }));
		const asideNode = creatorHtml.querySelector(".creator-about");
		const filmsNode = creatorHtml.querySelector(".creator-filmography");
		return this.buildCreator(+creatorId, asideNode, filmsNode, options);
	}
	buildCreator(id, asideEl, filmsNode, options) {
		const birthdayInfo = require_creator_helper.getCreatorBirthdayInfo(asideEl);
		return {
			id,
			name: require_creator_helper.getCreatorName(asideEl),
			birthday: birthdayInfo?.birthday,
			birthplace: birthdayInfo?.birthPlace,
			photo: require_creator_helper.getCreatorPhoto(asideEl),
			age: birthdayInfo?.age || null,
			bio: require_creator_helper.getCreatorBio(asideEl),
			films: require_creator_helper.getCreatorFilms(filmsNode, options)
		};
	}
};
//#endregion
exports.CreatorScraper = CreatorScraper;

//# sourceMappingURL=creator.service.cjs.map