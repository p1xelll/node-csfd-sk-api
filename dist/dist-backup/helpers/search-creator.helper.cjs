const require_global_helper = require("./global.helper.cjs");
//#region src/helpers/search-creator.helper.ts
const getCreatorName = (el) => {
	return el.querySelector(".user-title").text.trim();
};
const getCreatorImage = (el) => {
	const image = el.querySelector("img").attributes.src;
	return require_global_helper.addProtocol(image);
};
const getCreatorUrl = (el) => {
	return el.querySelector(".user-title a").attributes.href;
};
//#endregion
exports.getCreatorImage = getCreatorImage;
exports.getCreatorName = getCreatorName;
exports.getCreatorUrl = getCreatorUrl;

//# sourceMappingURL=search-creator.helper.cjs.map