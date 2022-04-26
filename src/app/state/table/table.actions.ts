import { createAction, props } from '@ngrx/store';

export const setTableFilter = createAction(
    '[Table] Set Filter',
    props<{ from: string; to: string; sortBy: string; sortDirection: string; fromChart: string; requestBody: any }>()
);

export const setTableData = createAction('[Table] Set Data', props<{ data: any[] }>());

export const setDoughnutChartData = createAction('[Doughnut Chart] Set Data', props<{ data: any[] }>());
