import { AppState } from '../app.state';
import { createSelector } from '@ngrx/store';
import { DashboardStateModel } from './dashboard.model';

export const selectDashboard = (state: AppState) => state.Dashboard;

export const selectDoughnutChart = createSelector(selectDashboard, (state: DashboardStateModel) => state.DoughnutChart);

export const selectHeatmapChart = createSelector(selectDashboard, (state: DashboardStateModel) => state.HeatmapChart);

export const selectLineChart = createSelector(selectDashboard, (state: DashboardStateModel) => state.LineChart);

export const selectTableChart = createSelector(selectDashboard, (state: DashboardStateModel) => state.TableChart);
