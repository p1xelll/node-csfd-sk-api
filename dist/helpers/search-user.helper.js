import { addProtocol } from "./global.helper.js";
import { NodeType } from "node-html-parser";
//#region src/helpers/search-user.helper.ts
const getUser = (el) => {
	return el.querySelector(".user-title-name").text;
};
const getUserRealName = (el) => {
	const p = el.querySelector(".article-content p");
	if (!p) return null;
	const textNodes = p.childNodes.filter((n) => n.nodeType === NodeType.TEXT_NODE && n.rawText.trim() !== "");
	return textNodes.length ? textNodes[0].rawText.trim() : null;
};
const getAvatar = (el) => {
	const image = el.querySelector(".article-img img").attributes.src;
	return addProtocol(image);
};
const getUserUrl = (el) => {
	return el.querySelector(".user-title-name").attributes.href;
};
//#endregion
export { getAvatar, getUser, getUserRealName, getUserUrl };

//# sourceMappingURL=search-user.helper.js.map