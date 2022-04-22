import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import * as echarts from 'echarts';
import { EChartsType } from 'echarts';
import { AggregateCategoryRequest } from '../../../interfaces/requests.interface';
import { FormGroup } from '@angular/forms';
import { EchartType } from '../../../enums/echart-type';
import { EchartService } from '../../../services/echart.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { selectDoughnutChart, selectHeatmapChart } from '../../../state/echarts/echarts.selectors';
import { setDoughnutChartFilter, setHeatmapChartFilter } from '../../../state/echarts/echarts.actions';

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
    maxDate: string = new Date().toISOString().slice(0, 7);

    constructor(private store: Store<AppState>, private echartService: EchartService) {}

    ngAfterViewInit() {
        if (this.echartType === EchartType.DOUGHNUT_CHART) this.echartData$ = this.store.select(selectDoughnutChart);
        else if (this.echartType === EchartType.HEATMAP_CHART) this.echartData$ = this.store.select(selectHeatmapChart);
        this.echartData$.subscribe(({ data, requestBody, filter, range }) => {
            this.echartOptions.series[0].data = data;
            this.filter = filter;
            this.requestBody = requestBody;
            if (this.echartType === EchartType.DOUGHNUT_CHART) this.form.setValue({ from: filter.from, to: filter.to });
            else {
                this.echartOptions.visualMap.min = range.min;
                this.echartOptions.visualMap.max = range.max;
                this.form.setValue({ date: filter.date, metrics: filter.metrics });
            }
        });

        this.echart = echarts.init(this.echartElement.nativeElement);
        this.getAndSetDataToChart();
    }

    getAndSetDataToChart() {
        if (this.echartType === EchartType.DOUGHNUT_CHART)
            this.store.dispatch(setDoughnutChartFilter({ ...this.form.value }));
        else {
            const formValue = this.form.value;
            const date = new Date(formValue.date);
            const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            const from = formValue.date + `-1`;
            const to = formValue.date + `-${lastDay}`;
            this.store.dispatch(setHeatmapChartFilter({ ...this.form.value, from, to }));
        }
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
