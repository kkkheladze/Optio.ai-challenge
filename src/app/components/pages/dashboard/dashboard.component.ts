import { Component, OnInit } from '@angular/core';
import { DoughnutOptions, HeatmapOptions } from '../../shared/echart/echart-options';
import { EchartType } from '../../../enums/echart-type';
import { FormControl, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { selectEcharts } from '../../../state/echarts/echarts.selectors';
import { Observable } from 'rxjs';
import { EchartsStateModel } from '../../../state/echarts/echarts.model';
import { AggregateCategoryRequest } from '../../../interfaces/requests.interface';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    echarts$!: Observable<EchartsStateModel>;
    ECHART_TYPE = EchartType;

    doughnutChartOptions = DoughnutOptions;
    doughnutChartRequestBody!: AggregateCategoryRequest;
    doughnutChartForm = new FormGroup({
        from: new FormControl('2018-01-01'),
        to: new FormControl('2018-01-31'),
    });

    heatmapChartOptions = HeatmapOptions;
    heatmapChartRequestBody!: AggregateCategoryRequest;
    heatmapChartForm = new FormGroup({
        date: new FormControl('2018-01'),
        metrics: new FormControl('volume'),
    });

    constructor(private store: Store<AppState>) {
        this.echarts$ = this.store.select(selectEcharts);
        this.echarts$.subscribe((state) => {
            this.doughnutChartRequestBody = state.DoughnutChart.requestBody;
            this.heatmapChartRequestBody = state.HeatmapChart.requestBody;
        });
    }
    ngOnInit() {}
}
