import { environment } from '@ntx/environments/environment';

export const SERVER = {
  baseUrl: environment.api.serverUrl + '/api',
  endpoints: {
    movies: {
      movies: '/v1/movies',
    },
    image: {
      poster: '/v1/poster',
      backdrops: '/v1/backdrops',
      imageProxy: '/v1/images-proxy',
    },
    library: {
      search: '/v1/library/search',
      externalMovies: '/v1/library/external-movies',
    },
    logs: {
      logs: '/v1/logs',
      columns: '/v1/logs-columns',
    },
  },
};

export function getMovieUrl(_id?: string): string {
  let url = `${SERVER.baseUrl}${SERVER.endpoints.movies.movies}`;
  if (_id) url += `/${_id}`;

  return url;
}

export function getMoviesOnPage(page: number): string {
  return `${SERVER.baseUrl}${SERVER.endpoints.movies.movies}?page=${page}&limit=50`;
}

export function getMoviePublishedUrl(_id: string): string {
  return `${SERVER.baseUrl}${SERVER.endpoints.movies.movies}/${_id}/published`;
}

export function getMoviePosterUrl(_id: string): string {
  return `${SERVER.baseUrl}${SERVER.endpoints.movies.movies}/${_id}/poster`;
}

export function getMovieBackdropUrl(_id: string): string {
  return `${SERVER.baseUrl}${SERVER.endpoints.movies.movies}/${_id}/backdrop`;
}

export function getPoster(_id: string, _size?: string) {
  let url = `${encodeURIComponent(_id)}`;
  if (_size) url += `?size=${encodeURIComponent(_size)}`;

  return url;
}

export function getBackdrop(_id: string) {
  return `${SERVER.baseUrl}${SERVER.endpoints.image.backdrops}/${_id}`;
}

export function replacePoster(_id: string) {
  return `${SERVER.baseUrl}${SERVER.endpoints.movies.movies}/${_id}/poster`;
}

export function getImageProxy(_url: string) {
  return `${SERVER.baseUrl}${SERVER.endpoints.image.imageProxy}?url=${encodeURIComponent(_url)}`;
}

export function getLibrarySearch(_query: string, _types: string, _providers: string, _limit?: number) {
  let url = `${SERVER.baseUrl}${SERVER.endpoints.library.search}?name=${encodeURIComponent(_query)}`;
  if (_limit !== undefined) url += `&limit=${_limit}`;

  return url;
}

export function getAuditLogs(_id: string): string {
  return `${SERVER.baseUrl}${SERVER.endpoints.movies.movies}/${_id}/logs`;
}

export function getLogColumns(): string {
  return `${SERVER.baseUrl}${SERVER.endpoints.logs.columns}`;
}

export function getLogsOnPage(page: number): string {
  return `${SERVER.baseUrl}${SERVER.endpoints.logs.logs}?page=${page}&limit=50`;
}
