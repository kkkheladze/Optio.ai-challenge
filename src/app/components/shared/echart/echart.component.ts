import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import * as echarts from 'echarts';
import { EChartsType } from 'echarts';
import { AggregateRequest, FindRequest } from '../../../interfaces/requests.interface';
import { FormGroup } from '@angular/forms';
import { EchartType } from '../../../enums/echart-type';
import { EchartService } from '../../../services/echart.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { selectDoughnutChart, selectHeatmapChart, selectLineChart } from '../../../state/echarts/echarts.selectors';
import {
    setDoughnutChartFilter,
    setHeatmapChartFilter,
    setLineChartFilter,
} from '../../../state/echarts/echarts.actions';
import {
    DoughnutChartStateModel,
    HeatmapChartStateModel,
    LineChartStateModel,
} from '../../../state/echarts/echarts.model';

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
    @Input('requestBody') requestBody!: AggregateRequest | FindRequest;
    @Input('endpoint') endpoint!: string;
    @ViewChild('echart') echartElement!: ElementRef;
    ECHART_TYPE = EchartType;
    echartData$!: Observable<HeatmapChartStateModel | DoughnutChartStateModel | LineChartStateModel>;
    echart!: EChartsType;
    filter!: any;
    maxDate: string = new Date().toISOString().slice(0, 7);

    constructor(private store: Store<AppState>, private echartService: EchartService) {}

    ngAfterViewInit() {
        this.setDataFromStateToComponentVariables();
        this.echart = echarts.init(this.echartElement.nativeElement);
        this.getAndSetDataToChart();
    }

    getAndSetDataToChart() {
        switch (this.echartType) {
            case EchartType.DOUGHNUT_CHART:
                this.store.dispatch(setDoughnutChartFilter({ ...this.form.value }));
                break;
            case EchartType.HEATMAP_CHART:
                const { from, to } = this.echartService.getFirstAndLastDayOfMonth(this.form);
                this.store.dispatch(setHeatmapChartFilter({ ...this.form.value, from, to }));
                break;
            case EchartType.LINE_CHART:
                this.store.dispatch(setLineChartFilter({ ...this.form.value }));
                break;
            default:
                break;
        }

        this.echartService.getDataFromApiAndSetToChart(
            this.echart,
            this.requestBody,
            this.echartOptions,
            this.echartType,
            this.endpoint
        );
    }

    setDataFromStateToComponentVariables() {
        if (this.echartType === EchartType.DOUGHNUT_CHART) this.echartData$ = this.store.select(selectDoughnutChart);
        else if (this.echartType === EchartType.HEATMAP_CHART) this.echartData$ = this.store.select(selectHeatmapChart);
        else if (this.echartType === EchartType.LINE_CHART) this.echartData$ = this.store.select(selectLineChart);

        this.echartData$.subscribe((props) => {
            switch (this.echartType) {
                case EchartType.DOUGHNUT_CHART:
                    this.echartOptions.series[0].data = props.data;
                    break;
                case EchartType.HEATMAP_CHART:
                    this.echartOptions.series[0].data = props.data;
                    const range = (props as HeatmapChartStateModel).range;
                    this.echartOptions.visualMap.min = range.min;
                    this.echartOptions.visualMap.max = range.max;
                    break;
                case EchartType.LINE_CHART:
                    this.echartOptions.series = props.data;
                    break;
                default:
                    break;
            }

            this.form.setValue({ ...props.filter });
            this.requestBody = props.requestBody;
        });
    }

    // Without this, echart canvas is not resizing on the viewport change.
    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        this.echart.resize();
        event.preventDefault();
    }
}
