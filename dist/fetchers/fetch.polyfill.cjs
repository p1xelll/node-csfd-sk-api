//#region src/fetchers/fetch.polyfill.ts
const fetchSafe = typeof fetch === "function" && fetch || typeof global === "object" && global.fetch || typeof window !== "undefined" && window.fetch;
//#endregion
exports.fetchSafe = fetchSafe;

//# sourceMappingURL=fetch.polyfill.cjs.map