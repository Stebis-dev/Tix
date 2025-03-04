import { Component } from '@angular/core';
import { LogsService, TableData } from '@ntx/app/shared/services/logs.service';

@Component({
  selector: 'app-log-list',
  standalone: true,
  imports: [],
  templateUrl: './log-list.component.html',
  styles: ``,
})
export class LogListComponent {
  columns: string[] = [];
  data: (TableData & Record<string, string>)[] = [];

  constructor(private service: LogsService) {}

  ngOnInit(): void {
    this.service.getColumns().subscribe((cols) => (this.columns = cols));
    this.service.getData().subscribe((data) => (this.data = data));
  }
}
