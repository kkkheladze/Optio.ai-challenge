import { createAction, props } from '@ngrx/store';
import { DoughnutChartData, LineChartData, TableChartData } from '../../interfaces/echart-data';

export const setDoughnutChartFilter = createAction(
    '[Doughnut Chart] Set Filter',
    props<{ from: string; to: string }>()
);

export const setDoughnutChartData = createAction('[Doughnut Chart] Set Data', props<{ data: DoughnutChartData[] }>());

export const setHeatmapChartFilter = createAction(
    '[Heatmap Chart] Set Filter',
    props<{ date: string; metrics: string; from: string; to: string }>()
);

export const setHeatmapChartData = createAction(
    '[Heatmap Chart] Set Data',
    props<{ data: (number | string)[][]; range: { min: number; max: number } }>()
);

export const setLineChartFilter = createAction('[Line Chart] Set Filter', props<{ from: string; to: string }>());

export const setLineChartData = createAction('[Line Chart] Set Data', props<{ data: LineChartData[] }>());

export const setTableChartFilter = createAction('[Table Chart] Set Filter', props<{ from: string; to: string }>());

export const setTableChartData = createAction('[Table Chart] Set Data', props<{ data: TableChartData[] }>());

//
// export const loadDoughnutChartFilter = createAction(
//     '[Doughnut Chart] Load Filter.',
//     props<{ from: string; to: string }>()
// );
