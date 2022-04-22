import { DoughnutChartData } from '../../interfaces/echart-data';
import { AggregateRequest } from '../../interfaces/requests.interface';

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

export interface EchartsStateModel {
    DoughnutChart: DoughnutChartStateModel;
    HeatmapChart: HeatmapChartStateModel;
}
