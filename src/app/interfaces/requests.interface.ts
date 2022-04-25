export interface AggregateRequest {
    dimension: string;
    types: string[];
    gteDate: string;
    lteDate: string;
    includeMetrics?: string[];
}

export interface FindRequest extends AggregateRequest {
    sortBy: string;
    sortDirection: string;
    pageIndex: number;
    pageSize: number;
    includes: string[];
}
