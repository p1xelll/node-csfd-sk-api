import { creatorUrl } from "../vars.js";
import { fetchPage } from "../fetchers/index.js";
import { getCreatorBio, getCreatorBirthdayInfo, getCreatorFilms, getCreatorName, getCreatorPhoto } from "../helpers/creator.helper.js";
import { parse } from "node-html-parser";
//#region src/services/creator.service.ts
var CreatorScraper = class {
	async creator(creatorId, options) {
		const id = Number(creatorId);
		if (isNaN(id)) throw new Error("node-csfd-api: creatorId must be a valid number");
		const creatorHtml = parse(await fetchPage(creatorUrl(id, {
			language: options?.language,
			domain: options?.domain
		}), { ...options?.request }));
		const asideNode = creatorHtml.querySelector(".creator-about");
		const filmsNode = creatorHtml.querySelector(".creator-filmography");
		return this.buildCreator(+creatorId, asideNode, filmsNode, options);
	}
	buildCreator(id, asideEl, filmsNode, options) {
		const birthdayInfo = getCreatorBirthdayInfo(asideEl);
		return {
			id,
			name: getCreatorName(asideEl),
			birthday: birthdayInfo?.birthday,
			birthplace: birthdayInfo?.birthPlace,
			photo: getCreatorPhoto(asideEl),
			age: birthdayInfo?.age || null,
			bio: getCreatorBio(asideEl),
			films: getCreatorFilms(filmsNode, options)
		};
	}
};
//#endregion
export { CreatorScraper };

//# sourceMappingURL=creator.service.js.map