import { addProtocol } from "./global.helper.js";
//#region src/helpers/search-creator.helper.ts
const getCreatorName = (el) => {
	return el.querySelector(".user-title").text.trim();
};
const getCreatorImage = (el) => {
	const image = el.querySelector("img").attributes.src;
	return addProtocol(image);
};
const getCreatorUrl = (el) => {
	return el.querySelector(".user-title a").attributes.href;
};
//#endregion
export { getCreatorImage, getCreatorName, getCreatorUrl };

//# sourceMappingURL=search-creator.helper.js.map