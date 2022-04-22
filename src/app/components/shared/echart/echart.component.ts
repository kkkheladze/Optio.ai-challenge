import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { DoughnutChartStateModel, HeatmapChartStateModel } from '../../../state/echarts/echarts.model';
import { EChartsType } from 'echarts';
import { AggregateCategoryRequest } from '../../../interfaces/requests.interface';
import { AbstractControl, FormGroup } from '@angular/forms';
import { EchartType } from '../../../enums/echart-type';
import * as echarts from 'echarts';
import { EchartService } from '../../../services/echart.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { selectDoughnutChart } from '../../../state/echarts/echarts.selectors';
import { setDoughnutChartFilter } from '../../../state/echarts/echarts.actions';

@Component({
    selector: 'app-echart',
    templateUrl: './echart.component.html',
    styleUrls: ['./echart.component.scss'],
})
export class EchartComponent implements AfterViewInit {
    @Input('title') title!: string;
    @Input('echartType') echartType!: EchartType;
    @Input('echartOptions') echartOptions: any;
    @Input('form') form!: FormGroup;
    @Input('requestBody') requestBody!: AggregateCategoryRequest;
    @ViewChild('echart') echartElement!: ElementRef;
    ECHART_TYPE = EchartType;
    echartData$!: Observable<any>; // TODO: try to use this as a type <HeatmapChartStateModel | DoughnutChartStateModel>
    echart!: EChartsType;
    filter!: any;

    constructor(private store: Store<AppState>, private echartService: EchartService) {
        this.echartData$ = this.store.select(selectDoughnutChart);
    }

    ngAfterViewInit() {
        this.echartData$.subscribe(({ data, requestBody, filter }) => {
            this.echartOptions.series[0].data = data;
            this.filter = filter;
            this.form.setValue({ ...filter });
            this.requestBody = requestBody;
        });

        this.echart = echarts.init(this.echartElement.nativeElement);
        this.getAndSetDataToChart();
    }

    getAndSetDataToChart() {
        this.store.dispatch(setDoughnutChartFilter({ ...this.form.value }));
        this.echartService.getDataFromApiAndSetToChart(
            this.echart,
            this.requestBody,
            this.echartOptions,
            this.echartType
        );
    }

    // Without this, echart canvas is not resizing on the viewport change.
    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        this.echart.resize();
        event.preventDefault();
    }
}
