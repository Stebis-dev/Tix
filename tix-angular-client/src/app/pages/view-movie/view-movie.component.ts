import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { getPoster } from '@ntx/app/shared/config/api-endpoints';
import { CssColor, TimeDelays, MediaConstants } from '@ntx/app/shared/config/constants';
import { MovieDTO } from '@ntx/app/shared/models/movie.dto';
import { PosterSize } from '@ntx/app/shared/models/posterSize.enum';
import { ImageService } from '@ntx/app/shared/services/image.service';
import { MovieService } from '@ntx/app/shared/services/movie/movie.service';
import { PosterService } from '@ntx/app/shared/services/posters/posters.service';
import { SvgIconsComponent } from '@ntx/app/shared/ui/svg-icons.component';
import { environment } from '@ntx/environments/environment';
import { timer } from 'rxjs';

@Component({
  selector: 'app-view-movie',
  standalone: true,
  imports: [SvgIconsComponent],
  templateUrl: './view-movie.component.html',
  styleUrl: './view-movie.component.scss',
})
export class ViewMovieComponent implements OnInit {
  movie: MovieDTO | undefined;
  posterUrl: string | null = null;
  backdropUrl: string | null = null;
  backdropColor: string = CssColor.TitleInspectBackgroundColor;
  pageBackgroundColor: string = CssColor.TitleInspectBackgroundColor;
  transparentColor: string = CssColor.TransparentColor;
  isFromCreation: boolean = false;
  uploadProgress: number = 0;
  isUploadingVideo: boolean = false;

  constructor(
    private readonly movieService: MovieService,
    private readonly posterService: PosterService,
    private readonly imageService: ImageService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const movieId = this.route.snapshot.paramMap.get('id') ?? '';
    const navigation = window.history.state || {};
    this.isFromCreation = navigation.from === 'creation';

    this.getMovieMetadata(movieId);
  }

  getMovieMetadata(movieId: string) {
    this.movieService.getMovieMetadata(movieId).subscribe({
      next: (response) => {
        this.movie = response;
        if (this.isFromCreation) {
          timer(TimeDelays.posterProcessingDelay).subscribe(() => {
            this.loadPoster(this.movie!.posterID, PosterSize.L);
            this.loadBackdrop(this.movie!.backdropID!);
          });
        } else {
          this.loadPoster(this.movie.posterID, PosterSize.L);
          this.loadBackdrop(this.movie.backdropID!);
        }
      },
      error: (errorResponse) => {
        if (environment.development) console.error('Error uploading metadata:', errorResponse);
        this.router.navigate(['error']);
      },
    });
  }

  loadPoster(id: string, size: string): void {
    this.posterUrl = this.movie?.posterID ?? null;
  }

  onPosterError(): void {
    this.posterUrl = null;
  }

  onWatchMovie(): void {
    this.router.navigate(['/watch/movie', this.movie?.id]);
  }

  loadBackdrop(id: string): void {
    if (id == null) return;

    this.posterService.getBackdrop(id).subscribe({
      next: async (blob: Blob) => {
        this.backdropUrl = URL.createObjectURL(blob);
        const backdropFile = new File([blob], 'backdrop.' + MediaConstants.image.exportFileExtension, {
          type: MediaConstants.image.exportMimeType,
          lastModified: Date.now(),
        });
        const getData = await this.imageService.getAverageColor(backdropFile);

        this.backdropColor = 'rgba(' + getData.r + ', ' + getData.g + ',  ' + getData.b + ', 0.5)';
      },
      error: (errorResponse) => {
        if (environment.development) console.error('Error loading backdrop:', errorResponse);
        this.backdropUrl = null;
      },
    });
  }

  getRuntimeLabel(): string {
    if (this.movie?.runtimeMinutes == undefined) return '';

    let totalSeconds = Math.floor(this.movie?.runtimeMinutes * 60);

    const hours: number = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const minutes: number = Math.floor(totalSeconds / 60);

    let formattedTimeString: string = '';

    if (hours > 0) formattedTimeString += `${hours}h `;

    formattedTimeString += `${minutes}m`;

    return formattedTimeString;
  }
}
