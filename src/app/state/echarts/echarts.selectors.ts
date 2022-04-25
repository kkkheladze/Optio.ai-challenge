import { AppState } from '../app.state';
import { createSelector } from '@ngrx/store';
import { EchartsStateModel } from './echarts.model';

export const selectEcharts = (state: AppState) => state.echarts;

export const selectDoughnutChart = createSelector(selectEcharts, (state: EchartsStateModel) => state.DoughnutChart);

export const selectHeatmapChart = createSelector(selectEcharts, (state: EchartsStateModel) => state.HeatmapChart);

export const selectLineChart = createSelector(selectEcharts, (state: EchartsStateModel) => state.LineChart);

export const selectTableChart = createSelector(selectEcharts, (state: EchartsStateModel) => state.TableChart);
