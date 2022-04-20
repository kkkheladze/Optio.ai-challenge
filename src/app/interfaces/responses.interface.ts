export interface AggregateCategoryResponse {
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
