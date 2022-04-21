import { DoughnutChartData } from '../../interfaces/echart-data';
import { AggregateCategoryRequest } from '../../interfaces/requests.interface';

export interface DoughnutChartStateModel {
    data: DoughnutChartData[];
    filter: {
        from: string;
        to: string;
    };
    requestBody: AggregateCategoryRequest;
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
    requestBody: AggregateCategoryRequest;
}

export interface EchartsStateModel {
    DoughnutChart: DoughnutChartStateModel;
    HeatmapChart: HeatmapChartStateModel;
}
