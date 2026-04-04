import { describe, expect, test } from 'vitest';
import {
  creatorUrl,
  detectDomainFromUrl,
  extractCreatorIdFromUrl,
  extractMovieIdFromUrl,
  extractUserIdFromUrl,
  getBaseDomain,
  getBaseUrl,
  movieUrl,
  searchUrl,
  setBaseDomain,
  userRatingsUrl
} from '../src/vars';

describe('Vars User Ratings', () => {
  test('Assemble User rating url', () => {
    const url = userRatingsUrl('912-bart', undefined, {});
    expect(url).toBe('https://www.csfd.cz/uzivatel/912-bart/hodnoceni/');
  });
  test('Assemble User rating. Page 2', () => {
    const url = userRatingsUrl('912-bart', 2, {});
    expect(url).toBe('https://www.csfd.cz/uzivatel/912-bart/hodnoceni/?page=2');
  });
  test('Assemble User rating url on sk domain', () => {
    const url = userRatingsUrl('912-bart', undefined, { domain: 'sk' });
    expect(url).toBe('https://www.csfd.sk/uzivatel/912-bart/hodnoceni/');
  });
});

describe('Vars Movies', () => {
  test('Assemble movieUrl with default domain', () => {
    const url = movieUrl(535121, {});
    expect(url).toBe('https://www.csfd.cz/film/535121/prehled/');
  });
  test('Assemble movieUrl with sk domain', () => {
    const url = movieUrl(535121, { domain: 'sk' });
    expect(url).toBe('https://www.csfd.sk/film/535121/prehled/');
  });
  test('Assemble movieUrl with cz domain and en language', () => {
    const url = movieUrl(535121, { domain: 'cz', language: 'en' });
    expect(url).toBe('https://www.csfd.cz/en/film/535121/prehled/');
  });
  test('Assemble movieUrl with sk domain and en language (lang ignored)', () => {
    const url = movieUrl(535121, { domain: 'sk', language: 'en' });
    expect(url).toBe('https://www.csfd.sk/film/535121/prehled/');
  });
});

describe('Vars Search', () => {
  test('Assemble searchUrl with default domain', () => {
    const url = searchUrl('matrix', {});
    expect(url).toBe('https://www.csfd.cz/hledat/?q=matrix');
  });
  test('Assemble searchUrl with sk domain', () => {
    const url = searchUrl('matrix', { domain: 'sk' });
    expect(url).toBe('https://www.csfd.sk/hledat/?q=matrix');
  });
});

describe('Vars Creator', () => {
  test('Assemble creatorUrl with default domain', () => {
    const url = creatorUrl('1', {});
    expect(url).toBe('https://www.csfd.cz/tvurce/1');
  });
  test('Assemble creatorUrl with sk domain', () => {
    const url = creatorUrl('1', { domain: 'sk' });
    expect(url).toBe('https://www.csfd.sk/tvurce/1');
  });
});

describe('Vars Base Domain', () => {
  test('Get default base domain', () => {
    expect(getBaseDomain()).toBe('cz');
  });
  test('Set and get base domain to sk', () => {
    setBaseDomain('sk');
    expect(getBaseDomain()).toBe('sk');
    // Reset to default
    setBaseDomain('cz');
    expect(getBaseDomain()).toBe('cz');
  });
});

describe('Vars getBaseUrl', () => {
  test('Get base URL with default domain', () => {
    expect(getBaseUrl()).toBe('https://www.csfd.cz');
  });
  test('Get base URL with cz domain', () => {
    expect(getBaseUrl('cz')).toBe('https://www.csfd.cz');
  });
  test('Get base URL with sk domain', () => {
    expect(getBaseUrl('sk')).toBe('https://www.csfd.sk');
  });
  test('Get base URL with cz domain and cs language', () => {
    expect(getBaseUrl('cz', 'cs')).toBe('https://www.csfd.cz');
  });
  test('Get base URL with cz domain and en language', () => {
    expect(getBaseUrl('cz', 'en')).toBe('https://www.csfd.cz/en');
  });
  test('Get base URL with cz domain and sk language', () => {
    expect(getBaseUrl('cz', 'sk')).toBe('https://www.csfd.cz/sk');
  });
  test('Get base URL with sk domain and en language (ignored)', () => {
    expect(getBaseUrl('sk', 'en')).toBe('https://www.csfd.sk');
  });
});

describe('Vars detectDomainFromUrl', () => {
  test('Detect cz domain from URL', () => {
    expect(detectDomainFromUrl('https://www.csfd.cz/film/1234/')).toBe('cz');
  });
  test('Detect sk domain from URL', () => {
    expect(detectDomainFromUrl('https://www.csfd.sk/film/1234/')).toBe('sk');
  });
  test('Return null for unknown domain', () => {
    expect(detectDomainFromUrl('https://example.com/film/1234/')).toBeNull();
  });
  test('Return null for empty string', () => {
    expect(detectDomainFromUrl('')).toBeNull();
  });
});

describe('Vars extractMovieIdFromUrl', () => {
  test('Extract movie ID from cz URL', () => {
    expect(extractMovieIdFromUrl('https://www.csfd.cz/film/1234-film-name/')).toBe(1234);
  });
  test('Extract movie ID from sk URL', () => {
    expect(extractMovieIdFromUrl('https://www.csfd.sk/film/5678-film-name/')).toBe(5678);
  });
  test('Return null for invalid URL', () => {
    expect(extractMovieIdFromUrl('https://example.com/other/1234/')).toBeNull();
  });
  test('Return null for empty string', () => {
    expect(extractMovieIdFromUrl('')).toBeNull();
  });
});

describe('Vars extractCreatorIdFromUrl', () => {
  test('Extract creator ID from cz URL', () => {
    expect(extractCreatorIdFromUrl('https://www.csfd.cz/tvurce/1234-creator-name/')).toBe(1234);
  });
  test('Extract creator ID from sk URL', () => {
    expect(extractCreatorIdFromUrl('https://www.csfd.sk/tvurce/5678-creator-name/')).toBe(5678);
  });
  test('Return null for invalid URL', () => {
    expect(extractCreatorIdFromUrl('https://example.com/other/1234/')).toBeNull();
  });
  test('Return null for empty string', () => {
    expect(extractCreatorIdFromUrl('')).toBeNull();
  });
});

describe('Vars extractUserIdFromUrl', () => {
  test('Extract user ID from cz URL', () => {
    expect(extractUserIdFromUrl('https://www.csfd.cz/uzivatel/1234-user-name/')).toBe(1234);
  });
  test('Extract user ID from sk URL', () => {
    expect(extractUserIdFromUrl('https://www.csfd.sk/uzivatel/5678-user-name/')).toBe(5678);
  });
  test('Return null for invalid URL', () => {
    expect(extractUserIdFromUrl('https://example.com/other/1234/')).toBeNull();
  });
  test('Return null for empty string', () => {
    expect(extractUserIdFromUrl('')).toBeNull();
  });
});
