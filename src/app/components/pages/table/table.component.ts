import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EchartService } from '../../../services/echart.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { Observable } from 'rxjs';
import { TableStateModel } from '../../../state/table/table.model';
import { selectTable } from '../../../state/table/table.selectors';
import { setTableData, setTableFilter } from '../../../state/table/table.actions';
import { TableDataInterface } from '../../../interfaces/table-data.interface';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
    table$: Observable<TableStateModel>;
    form: FormGroup = this.fb.group({
        from: this.fb.control(''),
        to: this.fb.control(''),
        sortBy: this.fb.control(''),
        sortDirection: this.fb.control(''),
        fromChart: this.fb.control(''),
    });
    loading: boolean = false;
    requestBody!: any;
    tableData!: TableDataInterface[];

    constructor(private store: Store<AppState>, private fb: FormBuilder, private echartService: EchartService) {
        this.table$ = this.store.select(selectTable);
    }

    async ngOnInit() {
        this.setDataFromStateToComponentVariables();
        await this.getAndSetDataToState();
    }

    async getAndSetDataToState() {
        this.loading = true;
        const { sortBy, sortDirection, from, to, fromChart } = this.form.value;

        const reqBody = this.getRequestBodyBasedOnSelectedChart(fromChart);

        this.requestBody = {
            ...this.requestBody,
            ...reqBody,
            sortBy,
            sortDirection,
            gteDate: from,
            lteDate: to,
        };

        await this.store.dispatch(setTableFilter({ ...this.form.value, requestBody: this.requestBody }));

        const response = await this.echartService.getEntireDataFromApiForLineChart('find', this.requestBody);
        await this.store.dispatch(setTableData({ data: response.data.entities }));
        this.loading = false;
    }

    getRequestBodyBasedOnSelectedChart(chart: string) {
        switch (chart) {
            case 'spendingCategory':
                return {
                    dimension: 'parent-category',
                    types: ['spending', 'withdrawal'],
                };
            case 'spendingHeatmap':
                return {
                    dimension: 'date',
                    types: ['spending', 'withdrawal'],
                };
            case 'incomeDynamics':
                return {
                    dimension: 'category',
                    types: ['income'],
                };
            default:
                return null;
        }
    }

    setDataFromStateToComponentVariables() {
        this.table$ = this.store.select(selectTable);
        this.table$.subscribe(({ filter, data, requestBody }) => {
            this.form.setValue({ ...filter });
            this.requestBody = requestBody;
            this.tableData = data;
        });
    }
}
