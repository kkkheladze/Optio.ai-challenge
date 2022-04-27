import { Component } from '@angular/core';
import { DoughnutOptions, HeatmapOptions, LineChartOptions } from '../../shared/echart/echart-options';
import { EchartType } from '../../../enums/echart-type';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { DashboardStateModel } from '../../../state/dashboard/dashboard.model';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
    echarts$!: Observable<DashboardStateModel>;
    ECHART_TYPE = EchartType;

    doughnutChartOptions = DoughnutOptions;
    doughnutChartForm = new FormGroup({
        from: new FormControl(''),
        to: new FormControl(''),
    });

    heatmapChartOptions = HeatmapOptions;
    heatmapChartForm = new FormGroup({
        date: new FormControl(''),
        metrics: new FormControl(''),
    });

    lineChartOptions = LineChartOptions;
    lineChartForm = new FormGroup({
        from: new FormControl(''),
        to: new FormControl(''),
    });
}
