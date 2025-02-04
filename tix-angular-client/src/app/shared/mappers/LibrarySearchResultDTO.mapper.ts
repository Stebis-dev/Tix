import { LibrarySearchResultDTO, SearchResultItem, MovieResultMetadata } from '../models/librarySearch.dto';
import { TitleType } from '@ntx-shared/models/titleType.enum';

export class LibrarySearchResultDTOMapper {
  static anyToLibrarySearchResultDTO(item: any): LibrarySearchResultDTO {
    const { limit, page, totalMovies, totalPages, movies } = item;

    return {
      size: item.movies.length,
      searchResults: [
        {
          id: 'ntx',
          size: item.movies.length,
          results: item.movies.map((result: any) => this.anyToSearchResultItem(result)),
        },
        {
          id: 'ntx-discovery',
          size: 0,
          results: [],
        },
      ],
    };
  }

  static anyToSearchResultItem(item: any): SearchResultItem {
    return {
      id: item._id,
      type: TitleType.MOVIE,
      metadata: this.anyToMovieResultMetadata(item),
      weight: 1,
      posterURL: item.thumbnail || null,
      backdropURL: undefined,
    };
  }

  static anyToMovieResultMetadata(item: any): MovieResultMetadata {
    return {
      name: item.title,
      originalName: item.title,
      summary: item.extract ?? '',
      releaseDate: item.year.toString(),
      runtimeMinutes: 0,
    };
  }
}
