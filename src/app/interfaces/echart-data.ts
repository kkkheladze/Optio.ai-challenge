export interface DoughnutChartData {
    value: number;
    name: string;
}

export interface LineChartData {
    data: number[];
    type: string;
    smooth: boolean;
    name: string;
}

export interface TableChartData {
    name: string;
    volume: number;
}
