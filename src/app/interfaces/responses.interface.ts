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
    data: {
        total: number;
        entities: { volume: number; dimension: string; date: string }[];
    };
    success: boolean;
}
