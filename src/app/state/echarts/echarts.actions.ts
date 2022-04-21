import { createAction, props } from '@ngrx/store';
import { DoughnutChartData } from '../../interfaces/echart-data';

export const setDoughnutChartFilter = createAction(
    '[Doughnut Chart] Set Filter',
    props<{ from: string; to: string }>()
);
//
// export const loadDoughnutChartFilter = createAction(
//     '[Doughnut Chart] Load Filter.',
//     props<{ from: string; to: string }>()
// );

export const setDoughnutChartData = createAction('[DoughnutChart] Set Data', props<{ data: DoughnutChartData[] }>());
