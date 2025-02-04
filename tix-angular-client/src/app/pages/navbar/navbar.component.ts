import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SvgIconsComponent } from '@ntx/app/shared/ui/svg-icons.component';
import { CommonModule } from '@angular/common';
import { SearchBarComponent } from '@ntx-shared/ui/search-bar/search-bar.component';
import { Provider } from '@ntx-shared/models/librarySearch.dto';
import { SearchResultDTO } from '@ntx-shared/models/searchResult.dto';
import { ViewerModeService } from '@ntx/app/shared/services/viewerMode.service';
interface NavbarProps {
  title: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, SvgIconsComponent, CommonModule, SearchBarComponent],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  @Input() props: NavbarProps = { title: '' };

  constructor(
    private readonly router: Router,
    private readonly viewerModeService: ViewerModeService
  ) {}

  get isCreateTitleRoute(): boolean {
    return this.router.url === '/create/title';
  }

  isLoggedIn(): boolean {
    return false;
  }

  getUserNameLetter(): string {
    return 'X';
  }

  getProviders() {
    return Provider.NTX.toString();
  }

  isManager(): boolean {
    return false;
  }

  redirectMain(): string {
    if (this.isViewerMode()) return '/';

    return this.isManager() ? '/manage/titles' : '/';
  }

  toggleViewerMode(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.viewerModeService.enableViewerMode();
      this.router.navigate(['/']);
    } else {
      this.viewerModeService.disableViewerMode();
      this.router.navigate(['/manage/titles']);
    }
  }

  isViewerMode(): boolean {
    return this.viewerModeService.isViewerMode();
  }

  isCreateMovieEnabled(): boolean {
    return this.isManager() && !this.isViewerMode();
  }

  onMovieSelected(movie: SearchResultDTO) {
    if (movie == null || movie.id == null) return;

    this.router.navigate(['/view/movie', movie.id]);
  }
}
