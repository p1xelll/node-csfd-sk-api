#!/usr/bin/env node
import { csfd } from "../index.js";
import { homepage, name, version } from "../package.js";
import "dotenv/config";
import express from "express";

//#region src/bin/server.ts
const LOG_COLORS = {
	info: "\x1B[36m",
	warn: "\x1B[33m",
	error: "\x1B[31m",
	success: "\x1B[32m",
	reset: "\x1B[0m"
};
const LOG_SYMBOLS = {
	info: "ℹ️",
	warn: "⚠️",
	error: "❌",
	success: "✅"
};
const LOG_PADDED_SEVERITY = {
	info: "INFO   ",
	warn: "WARN   ",
	error: "ERROR  ",
	success: "SUCCESS"
};
var Errors = /* @__PURE__ */ function(Errors) {
	Errors["API_KEY_MISSING"] = "API_KEY_MISSING";
	Errors["API_KEY_INVALID"] = "API_KEY_INVALID";
	Errors["ID_MISSING"] = "ID_MISSING";
	Errors["MOVIE_FETCH_FAILED"] = "MOVIE_FETCH_FAILED";
	Errors["CREATOR_FETCH_FAILED"] = "CREATOR_FETCH_FAILED";
	Errors["SEARCH_FETCH_FAILED"] = "SEARCH_FETCH_FAILED";
	Errors["USER_RATINGS_FETCH_FAILED"] = "USER_RATINGS_FETCH_FAILED";
	Errors["USER_REVIEWS_FETCH_FAILED"] = "USER_REVIEWS_FETCH_FAILED";
	Errors["CINEMAS_FETCH_FAILED"] = "CINEMAS_FETCH_FAILED";
	Errors["PAGE_NOT_FOUND"] = "PAGE_NOT_FOUND";
	Errors["TOO_MANY_REQUESTS"] = "TOO_MANY_REQUESTS";
	return Errors;
}(Errors || {});
/**
* Optimized logging function.
* Uses global constants to avoid memory reallocation on every request.
*/
function logMessage(severity, log, req) {
	const time = (/* @__PURE__ */ new Date()).toISOString();
	const reqInfo = req ? `${req.method}: ${req.originalUrl}` : "";
	const reqIp = req ? req.headers["x-forwarded-for"] || req.socket.remoteAddress || req.ip || req.ips : "";
	const msg = `${LOG_COLORS[severity]}[${LOG_PADDED_SEVERITY[severity]}]${LOG_COLORS.reset} ${time} | IP: ${reqIp} ${LOG_SYMBOLS[severity]} ${log.error ? log.error + ":" : ""} ${log.message} 🔗 ${reqInfo}`;
	const logSuccessEnabled = process.env.VERBOSE === "true";
	if (severity === "success") {
		if (logSuccessEnabled) console.log(msg);
	} else if (severity === "error") console.error(msg);
	else if (severity === "warn") console.warn(msg);
	else console.log(msg);
}
var Endpoint = /* @__PURE__ */ function(Endpoint) {
	Endpoint["MOVIE"] = "/movie/:id";
	Endpoint["CREATOR"] = "/creator/:id";
	Endpoint["SEARCH"] = "/search/:query";
	Endpoint["USER_RATINGS"] = "/user-ratings/:id";
	Endpoint["USER_REVIEWS"] = "/user-reviews/:id";
	Endpoint["CINEMAS"] = "/cinemas";
	return Endpoint;
}(Endpoint || {});
const app = express();
const port = process.env.PORT || 3e3;
const API_KEY_NAME = process.env.API_KEY_NAME || "x-api-key";
const API_KEY = process.env.API_KEY;
const RAW_LANGUAGE = process.env.LANGUAGE;
const isSupportedLanguage = (value) => value === "cs" || value === "en" || value === "sk";
const BASE_LANGUAGE = isSupportedLanguage(RAW_LANGUAGE) ? RAW_LANGUAGE : void 0;
const API_KEYS_LIST = API_KEY ? API_KEY.split(/[,;\s]+/).map((k) => k.trim()).filter(Boolean) : [];
if (BASE_LANGUAGE) csfd.setOptions({ language: BASE_LANGUAGE });
app.use((req, res, next) => {
	if (API_KEY) {
		const apiKey = req.get(API_KEY_NAME)?.trim();
		if (!apiKey) {
			const log = {
				error: Errors.API_KEY_MISSING,
				message: `Missing API key in request header: ${API_KEY_NAME}`
			};
			logMessage("error", log, req);
			res.status(401).json(log);
			return;
		}
		if (!API_KEYS_LIST.includes(apiKey)) {
			const log = {
				error: Errors.API_KEY_INVALID,
				message: `Invalid API key in request header: ${API_KEY_NAME}`
			};
			logMessage("error", log, req);
			res.status(401).json(log);
			return;
		}
	}
	next();
});
app.get("/", (_, res) => {
	logMessage("info", {
		error: null,
		message: "/"
	});
	res.json({
		name,
		version,
		docs: homepage,
		links: Object.values(Endpoint)
	});
});
app.get([
	"/movie/",
	"/creator/",
	"/search/",
	"/user-ratings/",
	"/user-reviews/"
], (req, res) => {
	const log = {
		error: Errors.ID_MISSING,
		message: `ID is missing. Provide ID like this: ${req.url}${req.url.endsWith("/") ? "" : "/"}1234`
	};
	logMessage("warn", log, req);
	res.status(404).json(log);
});
app.get(Endpoint.MOVIE, async (req, res) => {
	const rawLanguage = req.query.language;
	const language = isSupportedLanguage(rawLanguage) ? rawLanguage : void 0;
	try {
		const movie = await csfd.movie(+req.params.id, { language });
		res.json(movie);
		logMessage("success", {
			error: null,
			message: `${Endpoint.MOVIE}: ${req.params.id}${language ? ` [${language}]` : ""}`
		}, req);
	} catch (error) {
		const log = {
			error: Errors.MOVIE_FETCH_FAILED,
			message: "Failed to fetch movie data: " + error
		};
		logMessage("error", log, req);
		res.status(500).json(log);
	}
});
app.get(Endpoint.CREATOR, async (req, res) => {
	const rawLanguage = req.query.language;
	const language = isSupportedLanguage(rawLanguage) ? rawLanguage : void 0;
	try {
		const result = await csfd.creator(+req.params.id, { language });
		res.json(result);
		logMessage("success", {
			error: null,
			message: `${Endpoint.CREATOR}: ${req.params.id}${language ? ` [${language}]` : ""}`
		}, req);
	} catch (error) {
		const log = {
			error: Errors.CREATOR_FETCH_FAILED,
			message: "Failed to fetch creator data: " + error
		};
		logMessage("error", log, req);
		res.status(500).json(log);
	}
});
app.get(Endpoint.SEARCH, async (req, res) => {
	const rawLanguage = req.query.language;
	const language = isSupportedLanguage(rawLanguage) ? rawLanguage : void 0;
	try {
		const result = await csfd.search(req.params.query, { language });
		res.json(result);
		logMessage("success", {
			error: null,
			message: `${Endpoint.SEARCH}: ${req.params.query}${language ? ` [${language}]` : ""}`
		}, req);
	} catch (error) {
		const log = {
			error: Errors.SEARCH_FETCH_FAILED,
			message: "Failed to fetch search data: " + error
		};
		logMessage("error", log, req);
		res.status(500).json(log);
	}
});
app.get(Endpoint.USER_RATINGS, async (req, res) => {
	const { allPages, allPagesDelay, excludes, includesOnly, page } = req.query;
	const rawLanguage = req.query.language;
	const language = isSupportedLanguage(rawLanguage) ? rawLanguage : void 0;
	try {
		const result = await csfd.userRatings(req.params.id, {
			allPages: allPages === "true",
			allPagesDelay: allPagesDelay ? +allPagesDelay : void 0,
			excludes: excludes ? excludes.split(",") : void 0,
			includesOnly: includesOnly ? includesOnly.split(",") : void 0,
			page: page ? +page : void 0
		}, { language });
		res.json(result);
		logMessage("success", {
			error: null,
			message: `${Endpoint.USER_RATINGS}: ${req.params.id}${language ? ` [${language}]` : ""}`
		}, req);
	} catch (error) {
		const log = {
			error: Errors.USER_RATINGS_FETCH_FAILED,
			message: "Failed to fetch user-ratings data: " + error
		};
		logMessage("error", log, req);
		res.status(500).json(log);
	}
});
app.get(Endpoint.USER_REVIEWS, async (req, res) => {
	const { allPages, allPagesDelay, excludes, includesOnly, page } = req.query;
	const rawLanguage = req.query.language;
	const language = isSupportedLanguage(rawLanguage) ? rawLanguage : void 0;
	try {
		const result = await csfd.userReviews(req.params.id, {
			allPages: allPages === "true",
			allPagesDelay: allPagesDelay ? +allPagesDelay : void 0,
			excludes: excludes ? excludes.split(",") : void 0,
			includesOnly: includesOnly ? includesOnly.split(",") : void 0,
			page: page ? +page : void 0
		}, { language });
		res.json(result);
		logMessage("success", {
			error: null,
			message: `${Endpoint.USER_REVIEWS}: ${req.params.id}${language ? ` [${language}]` : ""}`
		}, req);
	} catch (error) {
		const log = {
			error: Errors.USER_REVIEWS_FETCH_FAILED,
			message: "Failed to fetch user-reviews data: " + error
		};
		logMessage("error", log, req);
		res.status(500).json(log);
	}
});
app.get(Endpoint.CINEMAS, async (req, res) => {
	const rawLanguage = req.query.language;
	const language = isSupportedLanguage(rawLanguage) ? rawLanguage : void 0;
	try {
		const result = await csfd.cinema(1, "today", { language });
		logMessage("success", {
			error: null,
			message: `${Endpoint.CINEMAS}${language ? ` [${language}]` : ""}`
		}, req);
		res.json(result);
	} catch (error) {
		const log = {
			error: Errors.CINEMAS_FETCH_FAILED,
			message: "Failed to fetch cinemas data: " + error
		};
		logMessage("error", log, req);
		res.status(500).json(log);
	}
});
app.use((req, res) => {
	const log = {
		error: Errors.PAGE_NOT_FOUND,
		message: "The requested endpoint could not be found."
	};
	logMessage("warn", log, req);
	res.status(404).json(log);
});
app.listen(port, () => {
	console.log(`
                  _                  __    _               _
                 | |                / _|  | |             (_)
  _ __   ___   __| | ___    ___ ___| |_ __| |   __ _ _ __  _
 | '_ \\ / _ \\ / _\` |/ _ \\  / __/ __|  _/ _\` |  / _\` | '_ \\| |
 | | | | (_) | (_| |  __/ | (__\\__ \\ || (_| | | (_| | |_) | |
 |_| |_|\\___/ \\__,_|\\___|  \\___|___/_| \\__,_|  \\__,_| .__/|_|
                                                    | |
                                                    |_|
`);
	console.log(`node-csfd-api@${version}\n`);
	console.log(`Docs: ${homepage}`);
	console.log(`Endpoints: ${Object.values(Endpoint).join(", ")}\n`);
	console.log(`API is running on: http://localhost:${port}`);
	if (BASE_LANGUAGE) console.log(`Base language configured: ${BASE_LANGUAGE}\n`);
	if (API_KEYS_LIST.length === 0) console.log("\x1B[31m%s\x1B[0m", "⚠️ Server is OPEN!\n- Your server will be open to the world and potentially everyone can use it without any restriction.\n- To enable some basic protection, set API_KEY environment variable (single value or comma-separated list) and provide the same value in request header: " + API_KEY_NAME);
	else console.log("\x1B[32m%s\x1B[0m", `✔️ Server is protected (somehow).\n- ${API_KEYS_LIST.length} API key(s) are configured and will be checked for each request header: ${API_KEY_NAME}`);
});

//#endregion
export {  };