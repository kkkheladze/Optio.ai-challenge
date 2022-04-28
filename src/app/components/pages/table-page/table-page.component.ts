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
import { ActivatedRoute, Router } from '@angular/router';
import { UtilsService } from '../../../services/utils.service';
import { ApiService } from '../../../services/api.service';

@Component({
    selector: 'app-table-page',
    templateUrl: './table-page.component.html',
    styleUrls: ['./table-page.component.scss'],
})
export class TablePageComponent implements OnInit {
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

    constructor(
        private store: Store<AppState>,
        private fb: FormBuilder,
        private echartService: EchartService,
        private apiService: ApiService,
        private router: Router,
        private route: ActivatedRoute,
        private utils: UtilsService
    ) {
        this.table$ = this.store.select(selectTable);
    }

    async ngOnInit() {
        this.form.valueChanges.subscribe(() => {
            this.form.markAsTouched();
        });
        this.subscribeToStore();
        this.handleQueryParams();
        await this.submitSearch();
    }

    async submitSearch() {
        this.loading = true;
        await this.router.navigate([], {
            queryParams: {
                ...this.form.value,
            },
            queryParamsHandling: 'merge',
        });
        const { sortBy, sortDirection, from, to, fromChart } = this.form.value;
        const reqBody = this.utils.getRequestBodyBasedOnSelectedChart(fromChart);
        this.requestBody = {
            ...this.requestBody,
            ...reqBody,
            sortBy,
            sortDirection,
            gteDate: from,
            lteDate: to,
        };

        await this.store.dispatch(setTableFilter({ ...this.form.value, requestBody: this.requestBody }));

        const response = await this.apiService.getEntireDataFromApiForLineChart('find', this.requestBody);
        await this.store.dispatch(setTableData({ data: response.data.entities }));
        this.loading = false;

        this.form.markAsUntouched();
    }

    subscribeToStore() {
        this.table$ = this.store.select(selectTable);
        this.table$.subscribe(({ filter, data, requestBody }) => {
            this.form.setValue({ ...filter });
            this.requestBody = requestBody;
            this.tableData = data;
        });
    }

    handleQueryParams() {
        this.route.queryParams.subscribe(async (params) => {
            if (Object.keys(params).length === 0) return;

            this.form.setValue({
                ...this.form.value,
                ...params,
            });

            const { from, to, fromChart, sortBy, sortDirection } = this.form.value;
            const reqBody = this.utils.getRequestBodyBasedOnSelectedChart(fromChart);
            this.requestBody = {
                ...this.requestBody,
                ...reqBody,
                sortBy,
                sortDirection,
                gteDate: from,
                lteDate: to,
            };
        });
    }
}
