import { Component, HostListener, OnInit } from '@angular/core';
import { ErrorHandlerService } from '@ntx/app/shared/services/errorHandler.service';
import { LogsService, TableData } from '@ntx/app/shared/services/logs.service';
import { environment } from '@ntx/environments/environment';

@Component({
  selector: 'app-log-list',
  standalone: true,
  imports: [],
  templateUrl: './log-list.component.html',
  styles: ``,
})
export class LogListComponent implements OnInit {
  columns: string[] = [];
  logs: (TableData & Record<string, string>)[] = [];
  currentPage = 1;
  totalPages = 1;
  isLoading = false;

  constructor(
    private service: LogsService,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.service.getColumns().subscribe((cols) => (this.columns = cols));
    this.loadLogs();
  }

  loadLogs() {
    if (this.isLoading) return;

    this.isLoading = true;

    this.service.getLogs(this.currentPage).subscribe({
      next: (response) => {
        if (environment.development) console.log('Get logs:', response);

        if (this.currentPage === 1) {
          this.logs = response.logs;
        } else {
          this.logs = [...this.logs, ...response.logs];
        }
        // const uniqueLogIds = new Set(this.logs.map((log) => log.LineId));
        // this.logs = this.logs.filter((log) => uniqueLogIds.has(log.LineId));

        this.totalPages = response.totalPages;
        this.isLoading = false;
      },
      error: (errorResponse) => {
        if (environment.development) console.error('Error getting data:', errorResponse);
        this.errorHandler.showError('Please try again later.', 'Initial server error');
        this.isLoading = false;
      },
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const threshold = 2000;
    const position = window.innerHeight + window.scrollY;
    const height = document.body.scrollHeight;

    if (position >= height - threshold) {
      if (!this.isLoading && this.currentPage < this.totalPages) {
        this.currentPage++;
        this.loadLogs();
      }
    }
  }
}
