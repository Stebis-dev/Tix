import { MovieDTO } from '../models/movie.dto';

export class MovieDTOMapper {
  static anyToMovieDTOArray(items: any[]): MovieDTO[] {
    return items.map((item) => this.anyToMovieDTO(item));
  }

  static anyToMovieDTO(item: any): MovieDTO {
    return {
      id: item._id,
      createdAt: new Date(item.year.toString()),
      updatedAt: new Date(item.year.toString()),
      name: item.title,
      summary: item.extract,
      originallyReleasedAt: new Date(item.year.toString()),
      runtimeMinutes: 0,
      posterID: item.thumbnail,
      videoID: undefined,
      isPublished: true,
    };
  }
}
