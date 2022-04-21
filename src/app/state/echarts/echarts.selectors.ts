import { AppState } from '../app.state';
import { createSelector } from '@ngrx/store';
import { EchartsStateModel } from './echarts.model';

export const selectEcharts = (state: AppState) => state.echarts;

export const selectDoughnutChart = createSelector(selectEcharts, (state: EchartsStateModel) => state.DoughnutChart);
