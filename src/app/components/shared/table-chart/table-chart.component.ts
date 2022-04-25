import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { selectTableChart } from '../../../state/echarts/echarts.selectors';
import { TableChartStateModel } from '../../../state/echarts/echarts.model';
import { TableChartData } from '../../../interfaces/echart-data';
import { AggregateResponse } from '../../../interfaces/responses.interface';
import { setTableChartData } from '../../../state/echarts/echarts.actions';

@Component({
    selector: 'app-table-chart',
    templateUrl: './table-chart.component.html',
    styleUrls: ['./table-chart.component.scss'],
})
export class TableChartComponent implements OnInit {
    tableChart$: Observable<TableChartStateModel>;
    requestBody: any;
    merchants!: TableChartData[];

    constructor(private store: Store<AppState>, private apiService: ApiService) {
        this.tableChart$ = this.store.select(selectTableChart);
    }

    async ngOnInit() {
        this.tableChart$.subscribe(({ requestBody, filter, data }) => {
            this.requestBody = requestBody;
        });
        await this.getAndSetDataToState();
    }

    async getAndSetDataToState() {
        const res: AggregateResponse = (await this.apiService.getDataFromApi(
            'aggregate',
            this.requestBody
        )) as AggregateResponse;
        const data = res.data
            .sort((a, b) => b.volume - a.volume)
            .slice(0, 20)
            .map((merchant) => {
                return { volume: merchant.volume, name: merchant.dimension };
            });
        this.store.dispatch(setTableChartData({ data }));
    }
}
