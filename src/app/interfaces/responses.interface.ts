export interface AggregateResponse {
    data: [
        {
            dimension: string;
            dimensionId: string;
            volume: number;
            quantity: number;
            type: string;
        }
    ];
    success: boolean;
}

export interface FindResponse {
    data: [
        {
            dimension: string;
            date: string;
            volume: number;
        }
    ];
    success: boolean;
}
