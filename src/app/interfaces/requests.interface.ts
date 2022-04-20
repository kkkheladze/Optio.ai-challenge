export interface AggregateCategoryRequest {
    dimension: string;
    types: string[];
    gteDate: string;
    lteDate: string;
    includeMetrics: string[];
}
