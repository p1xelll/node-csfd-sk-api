import { CSFDCinemaPeriod } from './dto/cinema';
import { CSFDLanguage } from './dto/options';

export const LIB_PREFIX = '[node-csfd-api]';

export type CSFDDomain = 'cz' | 'sk';

type Options = {
  language?: CSFDLanguage;
  domain?: CSFDDomain;
};

// Domain base URLs
export const DOMAIN_MAP: Record<CSFDDomain, string> = {
  cz: 'https://www.csfd.cz',
  sk: 'https://www.csfd.sk'
};

// Language to domain mapping (path suffix for .cz domain)
const LANGUAGE_PATH_MAP: Record<CSFDLanguage, string> = {
  cs: '',
  en: '/en',
  sk: '/sk'
};

let BASE_DOMAIN: CSFDDomain = 'cz';

export const getBaseDomain = (): CSFDDomain => BASE_DOMAIN;
export const setBaseDomain = (domain: CSFDDomain): void => {
  BASE_DOMAIN = domain;
};

/**
 * Gets the base URL for the specified domain and language.
 * For .sk domain, language paths are not supported (csfd.sk is Slovak only).
 * For .cz domain, language paths are supported (/en, /sk).
 */
export const getBaseUrl = (domain?: CSFDDomain, language?: CSFDLanguage): string => {
  const dom = domain ?? BASE_DOMAIN;
  const baseUrl = DOMAIN_MAP[dom];

  // For .cz domain, add language path suffix
  if (dom === 'cz' && language) {
    return `${baseUrl}${LANGUAGE_PATH_MAP[language] || ''}`;
  }

  return baseUrl;
};

/**
 * Detects domain from a full URL string.
 * Returns 'cz' for csfd.cz, 'sk' for csfd.sk, or null if neither.
 */
export const detectDomainFromUrl = (url: string): CSFDDomain | null => {
  if (!url) return null;
  if (url.includes('csfd.cz')) return 'cz';
  if (url.includes('csfd.sk')) return 'sk';
  return null;
};

/**
 * Extracts a movie ID from a full URL.
 * Works for both csfd.cz and csfd.sk domains.
 * Example: https://www.csfd.cz/film/1234-film-name/ -> 1234
 */
export const extractMovieIdFromUrl = (url: string): number | null => {
  if (!url) return null;
  const match = url.match(/\/film\/(\d+)(?:-|$)/);
  return match ? +match[1] : null;
};

/**
 * Extracts a creator ID from a full URL.
 * Works for both csfd.cz and csfd.sk domains.
 * Example: https://www.csfd.cz/tvurce/1234-creator-name/ -> 1234
 */
export const extractCreatorIdFromUrl = (url: string): number | null => {
  if (!url) return null;
  const match = url.match(/\/tvurce\/(\d+)(?:-|$)/);
  return match ? +match[1] : null;
};

/**
 * Extracts a user ID from a full URL.
 * Works for both csfd.cz and csfd.sk domains.
 * Example: https://www.csfd.cz/uzivatel/1234-user-name/ -> 1234
 */
export const extractUserIdFromUrl = (url: string): number | null => {
  if (!url) return null;
  const match = url.match(/\/uzivatel\/(\d+)(?:-|$)/);
  return match ? +match[1] : null;
};

// User URLs
export const userUrl = (user: string | number, options: Options): string =>
  `${getBaseUrl(options?.domain, options?.language)}/uzivatel/${encodeURIComponent(user)}`;

export const userRatingsUrl = (
  user: string | number,
  page?: number,
  options: Options = {}
): string => `${userUrl(user, options)}/hodnoceni/${page ? '?page=' + page : ''}`;
export const userReviewsUrl = (
  user: string | number,
  page?: number,
  options: Options = {}
): string => `${userUrl(user, options)}/recenze/${page ? '?page=' + page : ''}`;

// Movie URLs
export const movieUrl = (movie: number, options: Options): string =>
  `${getBaseUrl(options?.domain, options?.language)}/film/${encodeURIComponent(movie)}/prehled/`;
// Creator URLs
export const creatorUrl = (creator: number | string, options: Options): string =>
  `${getBaseUrl(options?.domain, options?.language)}/tvurce/${encodeURIComponent(creator)}`;

// Cinema URLs
export const cinemasUrl = (
  district: number | string,
  period: CSFDCinemaPeriod,
  options: Options
): string =>
  `${getBaseUrl(options?.domain, options?.language)}/kino/?period=${period}&district=${district}`;

// Search URLs
export const searchUrl = (text: string, options: Options): string =>
  `${getBaseUrl(options?.domain, options?.language)}/hledat/?q=${encodeURIComponent(text)}`;
