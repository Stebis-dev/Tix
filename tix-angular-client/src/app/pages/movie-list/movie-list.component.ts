import { Component, HostListener, OnInit } from '@angular/core';
import { MovieCardComponent } from '@ntx/app/pages/movie-list/movie-card/movie-card.component';
import { MovieService } from '@ntx-shared/services/movie/movie.service';
import { MovieDTO } from '@ntx-shared/models/movie.dto';
import { environment } from '@ntx/environments/environment.development';
import { ErrorHandlerService } from '@ntx-shared/services/errorHandler.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-example',
  standalone: true,
  templateUrl: './movie-list.component.html',
  imports: [MovieCardComponent],
})
export class MovieListComponent implements OnInit {
  title = 'TIX';
  redirectUrl = '';
  movies: MovieDTO[] = [];

  currentPage = 1;
  totalPages = 1;
  isLoadingMovies = false;

  constructor(
    private readonly movieService: MovieService,
    private readonly route: ActivatedRoute,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  ngOnInit() {
    this.route.data.subscribe((data) => {
      this.redirectUrl = data['movieCardRedirect'] ?? '';
    });

    this.loadMovies();
  }

  loadMovies() {
    if (this.isLoadingMovies) return;

    this.isLoadingMovies = true;

    this.movieService.getMovies(this.currentPage).subscribe({
      next: (response) => {
        if (environment.development) console.log('Get movies:', response);

        if (this.currentPage === 1) {
          this.movies = response.movies;
        } else {
          this.movies = [...this.movies, ...response.movies];
        }
        const uniqueMovieIds = new Set(this.movies.map((movie) => movie.id));
        this.movies = this.movies.filter((movie) => uniqueMovieIds.has(movie.id));

        this.totalPages = response.totalPages;
        this.isLoadingMovies = false;
      },
      error: (errorResponse) => {
        if (environment.development) console.error('Error getting movies:', errorResponse);
        this.errorHandler.showError('Please try again later.', 'Initial server error');
        this.isLoadingMovies = false;
      },
    });
  }

  getRedirectUrl(): string {
    return this.redirectUrl;
  }

  isMoviePublished(movie: MovieDTO): boolean {
    if (this.redirectUrl == 'inspect/movie' || movie.isPublished) return true;

    return false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const threshold = 2000;
    const position = window.innerHeight + window.scrollY;
    const height = document.body.scrollHeight;

    if (position >= height - threshold) {
      if (!this.isLoadingMovies && this.currentPage < this.totalPages) {
        this.currentPage++;
        this.loadMovies();
      }
    }
  }
}
