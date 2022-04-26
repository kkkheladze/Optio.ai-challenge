import { AppState } from '../app.state';
import { createSelector } from '@ngrx/store';
import { DashboardStateModel } from './dashboard.model';

export const selectEcharts = (state: AppState) => state.echarts;

export const selectDoughnutChart = createSelector(selectEcharts, (state: DashboardStateModel) => state.DoughnutChart);

export const selectHeatmapChart = createSelector(selectEcharts, (state: DashboardStateModel) => state.HeatmapChart);

export const selectLineChart = createSelector(selectEcharts, (state: DashboardStateModel) => state.LineChart);

export const selectTableChart = createSelector(selectEcharts, (state: DashboardStateModel) => state.TableChart);
