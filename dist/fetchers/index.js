import { LIB_PREFIX } from "../vars.js";
import { fetchSafe } from "./fetch.polyfill.js";
//#region src/fetchers/index.ts
const browserProfiles = [
	{
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
		"Sec-Ch-Ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
		"Sec-Ch-Ua-Platform": "\"Windows\""
	},
	{
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
		"Sec-Ch-Ua": "\"Google Chrome\";v=\"130\", \"Chromium\";v=\"130\", \"Not_A Brand\";v=\"24\"",
		"Sec-Ch-Ua-Platform": "\"Windows\""
	},
	{
		"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
		"Sec-Ch-Ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
		"Sec-Ch-Ua-Platform": "\"macOS\""
	},
	{
		"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
		"Sec-Ch-Ua": "\"Google Chrome\";v=\"130\", \"Chromium\";v=\"130\", \"Not_A Brand\";v=\"24\"",
		"Sec-Ch-Ua-Platform": "\"macOS\""
	},
	{
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0",
		"Sec-Ch-Ua": "\"Microsoft Edge\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
		"Sec-Ch-Ua-Platform": "\"Windows\""
	},
	{
		"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
		"Sec-Ch-Ua": "\"Microsoft Edge\";v=\"130\", \"Chromium\";v=\"130\", \"Not_A Brand\";v=\"24\"",
		"Sec-Ch-Ua-Platform": "\"Windows\""
	}
];
const randomProfile = () => browserProfiles[Math.floor(Math.random() * browserProfiles.length)];
const baseHeaders = {
	Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
	"Accept-Language": "cs-CZ,cs;q=0.9,en-US;q=0.8,en;q=0.7",
	"Accept-Encoding": "gzip, deflate, br",
	"Cache-Control": "max-age=0",
	Connection: "keep-alive",
	"Sec-Ch-Ua-Mobile": "?0",
	"Sec-Fetch-Dest": "document",
	"Sec-Fetch-Mode": "navigate",
	"Sec-Fetch-Site": "none",
	"Sec-Fetch-User": "?1",
	"Upgrade-Insecure-Requests": "1"
};
const fetchPage = async (url, optionsRequest) => {
	try {
		const mergedHeaders = new Headers({
			...baseHeaders,
			...randomProfile()
		});
		if (optionsRequest?.headers) new Headers(optionsRequest.headers).forEach((value, key) => mergedHeaders.set(key, value));
		const { headers: _, ...restOptions } = optionsRequest || {};
		const response = await fetchSafe(url, {
			credentials: "omit",
			...restOptions,
			headers: mergedHeaders
		});
		if (!response.ok) throw new Error(`node-csfd-api: Bad response ${response.status} for url: ${url}`);
		const html = await response.text();
		if (html.includes("Making sure you're not a bot!")) console.warn("[node-csfd-api] Trap detected. You may be rate-limited or blocked by ČSFD.");
		return html;
	} catch (e) {
		if (e instanceof Error) console.error(LIB_PREFIX, e.message);
		else console.error(LIB_PREFIX, String(e));
		return "Error";
	}
};
//#endregion
export { fetchPage };

//# sourceMappingURL=index.js.map