import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { selectTableChart } from '../../../state/echarts/echarts.selectors';
import { TableChartStateModel } from '../../../state/echarts/echarts.model';
import { TableChartData } from '../../../interfaces/echart-data';
import { AggregateResponse } from '../../../interfaces/responses.interface';
import { setTableChartData, setTableChartFilter } from '../../../state/echarts/echarts.actions';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-table-chart',
    templateUrl: './table-chart.component.html',
    styleUrls: ['./table-chart.component.scss'],
})
export class TableChartComponent implements OnInit {
    tableChart$: Observable<TableChartStateModel>;
    requestBody: any;
    merchants!: TableChartData[];
    form: FormGroup;

    constructor(private store: Store<AppState>, private apiService: ApiService, private fb: FormBuilder) {
        this.tableChart$ = this.store.select(selectTableChart);
        this.form = fb.group({
            from: fb.control(''),
            to: fb.control(''),
        });
    }

    async ngOnInit() {
        this.tableChart$.subscribe(({ requestBody, filter, data }) => {
            this.requestBody = requestBody;
            this.form.setValue({
                ...filter,
            });
        });
        await this.getAndSetDataToState();
    }

    async getAndSetDataToState() {
        this.store.dispatch(setTableChartFilter({ ...this.form.value }));

        const response: AggregateResponse = (await this.apiService.getDataFromApi(
            'aggregate',
            this.requestBody
        )) as AggregateResponse;

        const data = this.transformDataFromApi(response);
        this.store.dispatch(setTableChartData({ data }));
    }

    transformDataFromApi(res: AggregateResponse) {
        return res.data
            .sort((a, b) => b.volume - a.volume)
            .slice(0, 20)
            .map((merchant) => {
                return { volume: Math.floor(merchant.volume), name: merchant.dimension };
            });
    }
}
