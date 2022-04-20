export interface AggregateCategory {
    data: [
        {
            dimension: string;
            dimensionId: string;
            volume: number;
            type: string;
        }
    ];
    success: boolean;
}
