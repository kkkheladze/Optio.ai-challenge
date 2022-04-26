export interface TableStateModel {
    data: any[];
    filter: {
        from: string;
        to: string;
        sortBy: string;
        fromChart: string;
        sortDirection: string;
    };
    requestBody: {
        sortBy: string;
        sortDirection: string;
        gteDate: string;
        lteDate: string;
        pageIndex: number;
        pageSize: number;
        includes: string[];
    };
}
