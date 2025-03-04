import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

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

@Injectable({
  providedIn: 'root',
})
export class LogsService {
  constructor() {}

  getColumns(): Observable<string[]> {
    return of(['LineId', 'Date', 'Time', 'Level', 'Node', 'Component', 'Content', 'Duration_ms']);
  }

  getData(): Observable<any> {
    return of([
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
    ]);
  }
}
