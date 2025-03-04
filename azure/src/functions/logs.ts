import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import * as snowflake from 'snowflake-sdk';

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

let snowConnect: snowflake.Connection;

(async () => {
    snowConnect = await connectToDatabase();
})();

export async function logs(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const page = parseInt(request.query.get("page") || '1', 10);
    const limit = parseInt(request.query.get("limit") || '10', 10);
    const offset = (page - 1) * limit;

    const tables = await fetchAllTables(snowConnect, limit, offset);

    return {
        body: JSON.stringify({ logs: tables, page: page, totalPages: 9999 }, null, 2),
    };
}


export async function connectToDatabase(): Promise<snowflake.Connection> {
    return new Promise((resolve, reject) => {
        const snowConnect = snowflake.createConnection({
            account: process.env.SNOWFLAKE_ACCOUNT,
            username: process.env.SNOWFLAKE_USER,
            password: process.env.SNOWFLAKE_PASSWORD,
        });


        snowConnect.connect((err, conn) => {
            if (err) {
                console.error('Unable to connect: ' + err.message);
                reject(new Error('Unable to connect: ' + err.message));
            } else {
                console.log('Successfully connected as id: ' + snowConnect.getId());
                resolve(snowConnect);
            }
        });
    });
}

export async function fetchAllTables(snowConnect: snowflake.Connection, limit: number, offset: number): Promise<TableData[]> {
    return new Promise((resolve, reject) => {
        snowConnect.execute({
            sqlText: `SELECT * FROM ND2.PUBLIC.LOGS_TABLE ORDER BY DATE DESC, TIME DESC LIMIT ${limit} OFFSET ${offset}`,
            complete: function (err, stmt, rows) {
                if (err) {
                    console.error('Failed to execute statement due to the following error: ' + err.message);
                    reject(err);
                } else {
                    console.log('Successfully executed statement: ' + stmt.getSqlText());
                    const mappedRows: TableData[] = rows.map((row) => ({
                        LineId: row.LINEID,
                        Date: row.DATE,
                        Time: row.TIME,
                        Level: row.LEVEL,
                        Node: row.NODE,
                        Component: row.COMPONENT,
                        Content: row.CONTENT,
                        Duration_ms: row.DURATION_MS,
                    }));
                    resolve(mappedRows);
                }
            },
        });
    });
}

export async function getColumns(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const columns = ['LineId', 'Date', 'Time', 'Level', 'Node', 'Component', 'Content', 'Duration ms'];
    return {
        body: JSON.stringify(columns, null, 2),
    };
}

app.http('logs', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: logs,
    route: 'v1/logs',
});

app.http('logs-columns', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: getColumns,
    route: 'v1/logs-columns',
});