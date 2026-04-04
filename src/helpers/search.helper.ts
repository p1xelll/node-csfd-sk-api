import { HTMLElement } from 'node-html-parser';
import { CSFDColorRating, CSFDFilmTypes } from '../dto/global';
import { CSFDMovieCreator } from '../dto/movie';
import { CSFDColors } from '../dto/user-ratings';
import { addProtocol, parseColor, parseFilmType, parseIdFromUrl } from './global.helper';

// Czech and Slovak labels for directors and actors in search results
type CreatorCz = 'Režie:' | 'Hrají:';
type CreatorSk = 'Réžia:' | 'Hrajú:';
type Creator = CreatorCz | CreatorSk;

export const getSearchType = (el: HTMLElement): CSFDFilmTypes => {
  const type = el.querySelectorAll('.film-title-info .info')[1];
  return parseFilmType(type?.innerText?.replace(/[{()}]/g, '')?.trim() || 'film');
};

export const getSearchTitle = (el: HTMLElement): string => {
  return el.querySelector('.film-title-name').text;
};

export const getSearchYear = (el: HTMLElement): number => {
  // Optimization: Use querySelector instead of querySelectorAll(...)[0]
  return +el.querySelector('.film-title-info .info')?.innerText.replace(/[{()}]/g, '');
};

export const getSearchUrl = (el: HTMLElement): string => {
  return el.querySelector('.film-title-name').attributes.href;
};

export const getSearchColorRating = (el: HTMLElement): CSFDColorRating => {
  return parseColor(
    el.querySelector('.article-header i.icon').classNames.split(' ').pop() as CSFDColors
  );
};

export const getSearchPoster = (el: HTMLElement): string => {
  const image = el.querySelector('img').attributes.src;
  return addProtocol(image);
};

export const getSearchOrigins = (el: HTMLElement): string[] => {
  const originsRaw = el.querySelector('.article-content p .info')?.text;
  if (!originsRaw) return [];
  const originsAll = originsRaw?.split(', ')?.[0];
  return originsAll?.split('/').map((country) => country.trim());
};

export const parseSearchPeople = (
  el: HTMLElement,
  type: 'directors' | 'actors',
  baseUrl: string
): CSFDMovieCreator[] => {
  let whoCz: CreatorCz;
  let whoSk: CreatorSk;
  if (type === 'directors') {
    whoCz = 'Režie:';
    whoSk = 'Réžia:';
  }
  if (type === 'actors') {
    whoCz = 'Hrají:';
    whoSk = 'Hrajú:';
  }

  const peopleNode = Array.from(el && el.querySelectorAll('.article-content p')).find(
    (el) => el.textContent.includes(whoCz) || el.textContent.includes(whoSk)
  );

  if (peopleNode) {
    const people = Array.from(peopleNode.querySelectorAll('a')) as unknown as HTMLElement[];

    return people.map((person) => {
      const href = person.attributes.href;
      return {
        id: parseIdFromUrl(href),
        name: person.innerText.trim(),
        url: href.startsWith('/') ? `${baseUrl}${href}` : href
      };
    });
  } else {
    return [];
  }
};
