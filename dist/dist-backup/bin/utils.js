#!/usr/bin/env node
//#region src/bin/utils.ts
const useColor = process.stdout.isTTY && !process.env["NO_COLOR"];
const c = {
	bold: (s) => useColor ? `\x1b[1m${s}\x1b[22m` : s,
	dim: (s) => useColor ? `\x1b[2m${s}\x1b[22m` : s,
	cyan: (s) => useColor ? `\x1b[36m${s}\x1b[39m` : s,
	green: (s) => useColor ? `\x1b[32m${s}\x1b[39m` : s,
	yellow: (s) => useColor ? `\x1b[33m${s}\x1b[39m` : s,
	red: (s) => useColor ? `\x1b[31m${s}\x1b[39m` : s,
	blue: (s) => useColor ? `\x1b[34m${s}\x1b[39m` : s
};
const err = (msg) => c.red(c.bold("✖ Error:")) + " " + msg;
const escapeCsvField = (value) => {
	const needsQuotes = /[",\n\r]/.test(value);
	const escaped = value.replaceAll("\"", "\"\"");
	return needsQuotes ? `"${escaped}"` : escaped;
};
const renderProgress = (page, total) => {
	const pct = Math.round(page / total * 100);
	const filled = Math.round(page / total * 20);
	const bar = "█".repeat(filled) + "░".repeat(20 - filled);
	process.stdout.write(`\r  [${bar}]  ${page}/${total} pages  ${pct}%`);
	if (page === total) process.stdout.write("\n");
};

//#endregion
export { c, err, escapeCsvField, renderProgress };