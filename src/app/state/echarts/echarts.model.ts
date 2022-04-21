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
export interface EchartsStateModel {
    DoughnutChart: DoughnutChartStateModel;
}
