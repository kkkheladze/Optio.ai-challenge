import { DoughnutChartData, LineChartData, TableChartData } from '../../interfaces/echart-data';
import { AggregateRequest, FindRequest } from '../../interfaces/requests.interface';

export interface DoughnutChartStateModel {
    data: DoughnutChartData[];
    filter: {
        from: string;
        to: string;
    };
    requestBody: AggregateRequest;
}
export interface HeatmapChartStateModel {
    data: (number | string)[][];
    range: {
        min: number;
        max: number;
    };
    filter: {
        date: string;
        metrics: string;
    };
    requestBody: AggregateRequest;
}

export interface LineChartStateModel {
    data: LineChartData[];
    filter: {
        from: string;
        to: string;
    };
    requestBody: FindRequest;
}

export interface TableChartStateModel {
    data: TableChartData[];
    filter: {
        from: string;
        to: string;
    };
    requestBody: AggregateRequest;
}

export interface DashboardStateModel {
    DoughnutChart: DoughnutChartStateModel;
    HeatmapChart: HeatmapChartStateModel;
    LineChart: LineChartStateModel;
    TableChart: TableChartStateModel;
}
