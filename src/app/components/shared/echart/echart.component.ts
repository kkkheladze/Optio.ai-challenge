import { AfterViewInit, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import * as echarts from 'echarts';
import { EChartsType } from 'echarts';
import { AggregateRequest, FindRequest } from '../../../interfaces/requests.interface';
import { FormGroup } from '@angular/forms';
import { EchartType } from '../../../enums/echart-type';
import { EchartService } from '../../../services/echart.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../../state/app.state';
import { selectDoughnutChart, selectHeatmapChart, selectLineChart } from '../../../state/dashboard/dashboard.selectors';
import {
    setDoughnutChartFilter,
    setHeatmapChartFilter,
    setLineChartFilter,
} from '../../../state/dashboard/dashboard.actions';
import {
    DoughnutChartStateModel,
    HeatmapChartStateModel,
    LineChartStateModel,
} from '../../../state/dashboard/dashboard.model';
import { ECBasicOption } from 'echarts/types/dist/shared';
import { ApiService } from '../../../services/api.service';
import { AggregateResponse, FindResponse } from '../../../interfaces/responses.interface';
import { UtilsService } from '../../../services/utils.service';

@Component({
    selector: 'app-echart',
    templateUrl: './echart.component.html',
    styleUrls: ['./echart.component.scss'],
})
export class EchartComponent implements OnInit, AfterViewInit {
    @Input('title') title!: string;
    @Input('echartType') echartType!: EchartType;
    @Input('echartOptions') echartOptions: any;
    @Input('form') form!: FormGroup;
    @Input('endpoint') endpoint!: string;
    @ViewChild('echart') echartElement!: ElementRef;
    requestBody!: AggregateRequest | FindRequest;
    ECHART_TYPE = EchartType;
    echartData$!: Observable<HeatmapChartStateModel | DoughnutChartStateModel | LineChartStateModel>;
    echart!: EChartsType;
    maxDate: string = new Date().toISOString().slice(0, 7);

    constructor(
        private store: Store<AppState>,
        private echartService: EchartService,
        private apiService: ApiService,
        public utilsService: UtilsService
    ) {}

    ngOnInit() {
        if (this.echartType === EchartType.DOUGHNUT_CHART) this.subToDoughnutChart();
        else if (this.echartType === EchartType.HEATMAP_CHART) this.subToHeatmapChart();
        else if (this.echartType === EchartType.LINE_CHART) this.subToLineChart();
    }

    async ngAfterViewInit() {
        this.echart = echarts.init(this.echartElement.nativeElement);
        await this.submitSearch();
    }

    async submitSearch() {
        this.echart.showLoading();

        try {
            if (this.echartType === EchartType.DOUGHNUT_CHART) {
                this.store.dispatch(setDoughnutChartFilter({ ...this.form.value }));

                const data = await this.apiService.getDataFromApi(this.endpoint, this.requestBody);
                this.echartService.setDoughnutDataToState(data as AggregateResponse);
            } else if (this.echartType === EchartType.LINE_CHART) {
                this.store.dispatch(setLineChartFilter({ ...this.form.value }));

                const data = await this.apiService.getEntireDataFromApiForLineChart('find', this.requestBody);
                this.echartService.setLineDataToState(data as FindResponse);
            } else {
                const { from, to } = this.utilsService.getFirstAndLastDayOfMonth(this.form.value.date);

                this.store.dispatch(setHeatmapChartFilter({ ...this.form.value, from, to }));

                const data = await this.apiService.getDataFromApi(this.endpoint, this.requestBody);
                this.echartService.setHeatmapDataToState(data as AggregateResponse);
            }
        } catch (e) {
            alert(e);
            this.echart.hideLoading();
        }

        this.echart.setOption(<ECBasicOption>this.echartOptions);
        this.echart.hideLoading();
    }

    subToDoughnutChart() {
        this.echartData$ = this.store.select(selectDoughnutChart);
        this.echartData$.subscribe(({ data, filter, requestBody }) => {
            this.echartOptions.series[0].data = data;
            this.form.setValue({ ...filter });
            this.requestBody = requestBody;
        });
    }

    subToHeatmapChart() {
        this.echartData$ = this.store.select(selectHeatmapChart);
        this.echartData$.subscribe((props) => {
            const range = (props as HeatmapChartStateModel).range;
            this.echartOptions.series[0].data = props.data;
            this.echartOptions.visualMap.min = range.min;
            this.echartOptions.visualMap.max = range.max;
            this.form.setValue({ ...props.filter });
            this.requestBody = props.requestBody;
        });
    }

    subToLineChart() {
        this.echartData$ = this.store.select(selectLineChart);
        this.echartData$.subscribe(({ data, filter, requestBody }) => {
            this.echartOptions.series = data;
            this.form.setValue({ ...filter });
            this.requestBody = requestBody;
        });
    }

    // Without this, echart canvas is not resizing on the viewport change.
    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        this.echart.resize();
        event.preventDefault();
    }
}
