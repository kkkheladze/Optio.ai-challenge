import { DashboardStateModel } from './dashboard/dashboard.model';
import { TableStateModel } from './table/table.model';

export interface AppState {
    Dashboard: DashboardStateModel;
    Table: TableStateModel;
}
