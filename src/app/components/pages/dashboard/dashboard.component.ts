import { Component, OnInit } from '@angular/core';
import { DoughnutOptions, HeatmapOptions, LineChartOptions } from '../../shared/echart/echart-options';
import { EchartType } from '../../../enums/echart-type';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { Observable } from 'rxjs';
import { AggregateRequest, FindRequest } from '../../../interfaces/requests.interface';
import { DashboardStateModel } from '../../../state/dashboard/dashboard.model';
import { selectDashboard } from '../../../state/dashboard/dashboard.selectors';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    echarts$!: Observable<DashboardStateModel>;
    ECHART_TYPE = EchartType;

    doughnutChartOptions = DoughnutOptions;
    doughnutChartRequestBody!: AggregateRequest;
    doughnutChartForm = new FormGroup({
        from: new FormControl(''),
        to: new FormControl(''),
    });

    heatmapChartOptions = HeatmapOptions;
    heatmapChartRequestBody!: AggregateRequest;
    heatmapChartForm = new FormGroup({
        date: new FormControl(''),
        metrics: new FormControl(''),
    });

    lineChartOptions = LineChartOptions;
    lineChartRequestBody!: FindRequest;
    lineChartForm = new FormGroup({
        from: new FormControl(''),
        to: new FormControl(''),
    });
    constructor(private store: Store<AppState>) {
        this.echarts$ = this.store.select(selectDashboard);
        this.echarts$.subscribe((state) => {
            this.doughnutChartRequestBody = state.DoughnutChart.requestBody;
            this.heatmapChartRequestBody = state.HeatmapChart.requestBody;
            this.lineChartRequestBody = state.LineChart.requestBody;
        });
    }
    ngOnInit() {}
}
