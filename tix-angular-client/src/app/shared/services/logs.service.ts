/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { getLogColumns, getLogsOnPage } from '../config/api-endpoints';
import { HttpClient } from '@angular/common/http';
import { environment } from '@ntx/environments/environment';

export interface TableData {
  LineId: number;
  Date: string;
  Time: string;
  Level: string;
  Node: string;
  Component: string;
  Content: string;
  Duration_ms: string;
}

class FakeLogsService implements LogsService {
  constructor() {}

  private fakeLogsArray = [
    {
      LineId: 1,
      Date: '2024-12-04',
      Time: '11:00:53',
      Level: 'LOG',
      Node: 'NTX-Nest',
      Component: 'NestFactory',
      Content: 'Starting Nest application...',
      Duration_ms: '0',
    },
    {
      LineId: 2,
      Date: '2024-12-04',
      Time: '11:00:53',
      Level: 'LOG',
      Node: 'NTX-Nest',
      Component: 'InstanceLoader',
      Content: 'JobQueueModule dependencies initialized',
      Duration_ms: '4',
    },
    {
      LineId: 3,
      Date: '2024-12-04',
      Time: '11:00:53',
      Level: 'LOG',
      Node: 'NTX-Nest',
      Component: 'InstanceLoader',
      Content: 'BullBoardModule dependencies initialized',
      Duration_ms: '1',
    },
    {
      LineId: 4,
      Date: '2024-12-04',
      Time: '11:00:53',
      Level: 'LOG',
      Node: 'NTX-Nest',
      Component: 'InstanceLoader',
      Content: 'FileStorageModule dependencies initialized',
      Duration_ms: '0',
    },
    {
      LineId: 5,
      Date: '2024-12-04',
      Time: '11:00:53',
      Level: 'LOG',
      Node: 'NTX-Nest',
      Component: 'InstanceLoader',
      Content: 'JobQueueModule dependencies initialized',
      Duration_ms: '1',
    },
  ];

  public getColumns(): Observable<string[]> {
    return of(['LineId', 'Date', 'Time', 'Level', 'Node', 'Component', 'Content', 'Duration_ms']);
  }

  public getLogs(page?: number): Observable<{
    logs: any[];
    page: number;
    totalPages: number;
  }> {
    page = page ?? 1;

    return of({
      logs: [this.fakeLogsArray, this.fakeLogsArray, this.fakeLogsArray, this.fakeLogsArray, this.fakeLogsArray].flat(),
      page,
      totalPages: 20,
    });
  }
}

class AzureFunctionsLogsService implements LogsService {
  constructor(private readonly http: HttpClient) {}

  public getColumns(): Observable<string[]> {
    const url = getLogColumns();
    const httpOptions = {};

    return this.http.get(url, httpOptions).pipe(
      map((response: any) => {
        return response;
      }),
      catchError((error) => {
        if (environment.development) console.error('Error fetching log columns:', error);
        return throwError(() => error);
      })
    );
  }

  public getLogs(page?: number): Observable<{
    logs: any[];
    page: number;
    totalPages: number;
  }> {
    page = page ?? 1;
    const url = getLogsOnPage(page);
    const httpOptions = {};

    return this.http.get(url, httpOptions).pipe(
      map((response: any) => {
        const { page, limit, totallogs, totalPages, logs } = response;

        return {
          logs,
          page,
          totalPages,
        };
      }),
      catchError((error) => {
        if (environment.development) console.error('Error fetching logs:', error);
        return throwError(() => error);
      })
    );
  }
}

@Injectable({
  providedIn: 'root',
  deps: [HttpClient],
  useFactory: (http: HttpClient) => {
    if (environment.development) {
      return new FakeLogsService();
    } else {
      return new AzureFunctionsLogsService(http);
    }
  },
})
export abstract class LogsService {
  abstract getColumns(): Observable<string[]>;

  abstract getLogs(page?: number): Observable<{
    logs: any[];
    page: number;
    totalPages: number;
  }>;
}
