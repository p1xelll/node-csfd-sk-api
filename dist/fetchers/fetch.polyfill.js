//#region src/fetchers/fetch.polyfill.ts
const fetchSafe = typeof fetch === "function" && fetch || typeof global === "object" && global.fetch || typeof window !== "undefined" && window.fetch;
//#endregion
export { fetchSafe };

//# sourceMappingURL=fetch.polyfill.js.map