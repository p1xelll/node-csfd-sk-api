#!/usr/bin/env node
import { c, err } from "./bin/utils.js";

//#region src/cli.ts
/**
* Main CLI entry point for node-csfd-api.
*/
const GITHUB_REPO = "bartholomej/node-csfd-api";
const GITHUB_API_LATEST = `https://api.github.com/repos/${GITHUB_REPO}/releases/latest`;
const GITHUB_RELEASES_URL = `https://github.com/${GITHUB_REPO}/releases/latest`;
const INSTALL_SH_URL = `https://raw.githubusercontent.com/${GITHUB_REPO}/master/install.sh`;
function getCommandName() {
	const scriptPath = process.argv[1] ?? "";
	const basename = scriptPath.split("/").pop() ?? "";
	if (basename === "csfd" || basename === "node-csfd-api") return basename;
	if (scriptPath.includes("node-csfd-api")) return "npx node-csfd-api";
	return "csfd";
}
function parseNumericArg(raw, usage) {
	const n = Number(raw);
	if (!raw || isNaN(n)) {
		console.error(err("Please provide a valid numeric ID."));
		console.log(c.dim(`  Usage: ${usage}`));
		process.exit(1);
	}
	return n;
}
function parseFormat(args) {
	return args.includes("--json") ? "json" : "csv";
}
async function main() {
	const args = process.argv.slice(2);
	const command = args[0];
	const updateHint = new Set(["update"]).has(command) ? null : checkForUpdateInBackground();
	switch (command) {
		case "server":
		case "api":
			try {
				await import("./bin/server.js");
			} catch (error) {
				console.error("Failed to start server:", error);
				process.exit(1);
			}
			break;
		case "mcp":
			try {
				await import("./bin/mcp-server.js");
			} catch (error) {
				console.error("Failed to start MCP server:", error);
				process.exit(1);
			}
			break;
		case "export":
			if (args[1] === "ratings") {
				const userId = parseNumericArg(args[2], `${getCommandName()} export ratings <userId> [options]`);
				const isLetterboxd = args.includes("--letterboxd");
				const format = isLetterboxd ? "letterboxd" : parseFormat(args);
				try {
					const { runRatingsExport } = await import("./bin/export-ratings.js");
					await runRatingsExport(userId, {
						format,
						userRatingsOptions: {
							includesOnly: isLetterboxd ? ["film"] : void 0,
							allPages: true,
							allPagesDelay: 1e3
						}
					});
				} catch (error) {
					console.error(err("Failed to run export:"), error);
					process.exit(1);
				}
			} else if (args[1] === "reviews") {
				const userId = parseNumericArg(args[2], `${getCommandName()} export reviews <userId> [options]`);
				try {
					const { runReviewsExport } = await import("./bin/export-reviews.js");
					await runReviewsExport(userId, {
						format: parseFormat(args),
						userReviewsOptions: {
							allPages: true,
							allPagesDelay: 1e3
						}
					});
				} catch (error) {
					console.error(err("Failed to run export:"), error);
					process.exit(1);
				}
			} else if (args[1] === "letterboxd") {
				console.warn(c.yellow(c.bold("⚠ Deprecated:")) + " \"export letterboxd\" is removed. Use \"export ratings <id> --letterboxd\" instead.");
				console.log(c.dim(`  Usage: ${getCommandName()} export ratings <userId> --letterboxd`));
				process.exit(1);
			} else {
				console.error(err(`Unknown export target: ${c.bold(String(args[1]))}`));
				printUsage();
				process.exit(1);
			}
			break;
		case "search": {
			const query = args.slice(1).filter((a) => !a.startsWith("--")).join(" ");
			if (!query) {
				console.error(err("Please provide a search query."));
				console.log(c.dim(`  Usage: ${getCommandName()} search <query> [--json]`));
				process.exit(1);
			}
			try {
				const { runSearch } = await import("./bin/search.js");
				await runSearch(query, args.includes("--json"));
			} catch (error) {
				console.error(err("Search failed:"), error);
				process.exit(1);
			}
			break;
		}
		case "movie": {
			const input = args.slice(1).filter((a) => !a.startsWith("--")).join(" ");
			if (!input) {
				console.error(err("Please provide a movie ID or title."));
				console.log(c.dim(`  Usage: ${getCommandName()} movie <id|title> [--json] [--domain=cz|sk]`));
				process.exit(1);
			}
			const json = args.includes("--json");
			const domainArg = args.find((a) => a.startsWith("--domain="));
			const domain = domainArg ? domainArg.split("=")[1] : "cz";
			try {
				const { runMovieLookup } = await import("./bin/lookup-movie.js");
				const numericId = /^\d+$/.test(input) ? Number(input) : null;
				if (numericId !== null) await runMovieLookup(numericId, json, domain);
				else {
					const { csfd } = await import("./index.js");
					const results = await csfd.search(input, { domain });
					const first = results.movies[0] ?? results.tvSeries[0];
					if (!first) {
						console.error(err(`No movies found for "${input}".`));
						process.exit(1);
					}
					console.log(c.dim(`  → ${first.title}${first.year ? ` (${first.year})` : ""}`));
					await runMovieLookup(first.id, json, domain);
				}
			} catch (error) {
				console.error(err("Failed to fetch movie:"), error);
				process.exit(1);
			}
			break;
		}
		case "--version":
		case "-v":
			console.log(c.bold("5.8.1"));
			break;
		case "update":
			await runUpdate();
			break;
		default:
			printUsage();
			break;
	}
	if (updateHint) await updateHint;
}
function isRunningViaNpx() {
	const base = (process.execPath ?? "").split("/").pop() ?? "";
	return base === "node" || base === "node.exe" || base === "bun";
}
function isRunningViaHomebrew() {
	const exec = process.execPath ?? "";
	return exec.includes("/homebrew/") || exec.includes("/Cellar/");
}
function compareSemver(a, b) {
	const parse = (v) => {
		const [main, pre = ""] = v.split("-");
		const [major, minor, patch] = main.split(".").map(Number);
		return {
			major,
			minor,
			patch,
			pre
		};
	};
	const va = parse(a);
	const vb = parse(b);
	if (va.major !== vb.major) return va.major - vb.major;
	if (va.minor !== vb.minor) return va.minor - vb.minor;
	if (va.patch !== vb.patch) return va.patch - vb.patch;
	if (va.pre && !vb.pre) return -1;
	if (!va.pre && vb.pre) return 1;
	return va.pre.localeCompare(vb.pre);
}
async function fetchLatestVersion(timeoutMs = 5e3) {
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeoutMs);
	try {
		return (await (await fetch(GITHUB_API_LATEST, { signal: controller.signal })).json()).tag_name?.replace(/^v/, "") ?? "";
	} finally {
		clearTimeout(timer);
	}
}
function printUpgradeInstructions(latest) {
	console.log(c.green(c.bold("↑ New version available: ")) + c.bold(latest));
	if (isRunningViaNpx()) {
		console.log("\n" + c.bold("Run:"));
		console.log("  " + c.cyan("npx node-csfd-api@latest <command>"));
	} else if (isRunningViaHomebrew()) {
		console.log("\n" + c.bold("Run:"));
		console.log("  " + c.cyan("brew upgrade csfd"));
	} else if (process.platform === "win32") {
		console.log("\n" + c.bold("Download the latest release from:"));
		console.log("  " + c.cyan(GITHUB_RELEASES_URL));
	} else {
		console.log("\n" + c.bold("Run:"));
		console.log("  " + c.cyan(`curl -fsSL ${INSTALL_SH_URL} | bash`));
	}
}
const UPDATE_CACHE_TTL = 1440 * 60 * 1e3;
function getUpdateCachePath() {
	const home = process.env["HOME"] || process.env["USERPROFILE"] || "";
	return `${process.platform === "win32" ? process.env["APPDATA"] || home : process.env["XDG_CONFIG_HOME"] || `${home}/.config`}/csfd/update-check.json`;
}
async function checkForUpdateInBackground() {
	try {
		const { readFileSync, writeFileSync, mkdirSync } = await import("node:fs");
		const { dirname } = await import("node:path");
		const cachePath = getUpdateCachePath();
		let cache = null;
		try {
			cache = JSON.parse(readFileSync(cachePath, "utf-8"));
		} catch {}
		const now = Date.now();
		let latestVersion = cache?.latestVersion ?? "";
		if (!cache || now - cache.lastCheck > UPDATE_CACHE_TTL) try {
			const fetched = await fetchLatestVersion(3e3);
			if (fetched) {
				latestVersion = fetched;
				try {
					mkdirSync(dirname(cachePath), { recursive: true });
					writeFileSync(cachePath, JSON.stringify({
						lastCheck: now,
						latestVersion
					}));
				} catch {}
			}
		} catch {}
		if (!latestVersion || compareSemver("5.8.1", latestVersion) >= 0) return;
		console.log("");
		console.log(c.dim("  " + "─".repeat(44)));
		console.log(`  ${c.yellow(c.bold("↑ Update available:"))} ${c.dim("5.8.1")} → ${c.bold(c.green(latestVersion))}`);
		console.log(`  ${c.dim("Run")} ${c.cyan(getCommandName() + " update")} ${c.dim("for upgrade instructions.")}`);
	} catch {}
}
async function runUpdate() {
	console.log(c.dim("Current version: ") + c.bold("5.8.1"));
	console.log(c.dim("Checking for updates..."));
	let latest;
	try {
		latest = await fetchLatestVersion();
	} catch {
		console.error(err("Could not reach GitHub API."));
		process.exit(1);
	}
	if (!latest) {
		console.error(err("Could not determine latest version."));
		process.exit(1);
	}
	const cmp = compareSemver("5.8.1", latest);
	if (cmp === 0) {
		console.log(c.green("✔ Already up to date."));
		return;
	}
	if (cmp > 0) {
		console.log(c.yellow("⚠ You are running a pre-release version.") + c.dim(` Latest stable: ${latest}`));
		return;
	}
	printUpgradeInstructions(latest);
}
function printUsage() {
	const cmd = getCommandName();
	const header = c.bold(c.cyan("csfd")) + " " + c.dim(`v5.8.1`);
	const usage = c.bold("Usage:") + `  ${c.cyan(cmd)} ${c.dim("<command> [options]")}`;
	const section = (title) => c.bold(title);
	const cmd_ = (name) => "  " + c.cyan(name);
	const flag_ = (name) => "  " + c.dim(name);
	const desc = (text) => c.dim(text);
	const sub_ = (name) => "    " + c.dim(name);
	console.log(`
${header}

${usage}

${section("Commands:")}
${cmd_("server, api")}               ${desc("Start the REST API server")}
${cmd_("mcp")}                       ${desc("Start the MCP server for AI agents")}
${cmd_("export ratings <userId>")}   ${desc("Export user ratings")}
${sub_("--csv")}                     ${desc("CSV format (default)")}
${sub_("--json")}                    ${desc("JSON format")}
${sub_("--letterboxd")}              ${desc("Letterboxd-compatible CSV")}
${cmd_("export reviews <userId>")}   ${desc("Export user reviews")}
${sub_("--csv")}                     ${desc("CSV format (default)")}
${sub_("--json")}                    ${desc("JSON format")}
${cmd_("search <query>")}            ${desc("Search movies, series, creators and users")}
${cmd_("movie <id|title>")}          ${desc("Show movie details (ID or film name)")}
${sub_("--json")}                    ${desc("Output raw JSON")}
${cmd_("update")}                    ${desc("Check for updates")}
${cmd_("help")}                      ${desc("Show this help")}

${section("Flags:")}
${flag_("-v, --version")}            ${desc("Show version")}
${flag_("-h, --help")}               ${desc("Show this help")}
`);
}
main().catch((error) => {
	console.error(err("Fatal: " + String(error)));
	process.exit(1);
});

//#endregion
export {  };