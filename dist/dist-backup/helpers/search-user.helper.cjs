const require_global_helper = require("./global.helper.cjs");
let node_html_parser = require("node-html-parser");
//#region src/helpers/search-user.helper.ts
const getUser = (el) => {
	return el.querySelector(".user-title-name").text;
};
const getUserRealName = (el) => {
	const p = el.querySelector(".article-content p");
	if (!p) return null;
	const textNodes = p.childNodes.filter((n) => n.nodeType === node_html_parser.NodeType.TEXT_NODE && n.rawText.trim() !== "");
	return textNodes.length ? textNodes[0].rawText.trim() : null;
};
const getAvatar = (el) => {
	const image = el.querySelector(".article-img img").attributes.src;
	return require_global_helper.addProtocol(image);
};
const getUserUrl = (el) => {
	return el.querySelector(".user-title-name").attributes.href;
};
//#endregion
exports.getAvatar = getAvatar;
exports.getUser = getUser;
exports.getUserRealName = getUserRealName;
exports.getUserUrl = getUserUrl;

//# sourceMappingURL=search-user.helper.cjs.map