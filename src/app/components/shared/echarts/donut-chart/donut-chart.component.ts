import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { EChartsType } from 'echarts';
import { HttpClient } from '@angular/common/http';
import { AggregateCategory } from '../../../../interfaces/responses.interface';
import { DoughnutOptions } from '../shared/echart-options';
import { ApiService } from '../../../../services/api.service';
import { DoughnutChartData } from '../../../../interfaces/echart-data';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-donut-chart',
    templateUrl: './donut-chart.component.html',
    styleUrls: ['./donut-chart.component.scss'],
})
export class DonutChartComponent implements AfterViewInit, OnDestroy {
    @ViewChild('echart') echartElement!: ElementRef;
    echart!: EChartsType;
    echartOptions = DoughnutOptions;
    requestBody = {
        dimension: 'parent-category',
        types: ['spending', 'withdrawal'],
        gteDate: '2018-01-01',
        lteDate: '2018-01-31',
        includeMetrics: ['volume'],
    };
    subscription!: Subscription;

    constructor(private http: HttpClient, private apiService: ApiService) {}

    ngAfterViewInit() {
        this.echart = echarts.init(this.echartElement.nativeElement);
        this.setDataToChart();
    }

    setDataToChart() {
        this.subscription = this.apiService
            .getDataFromApi('/aggregate', this.requestBody)
            .subscribe((res: AggregateCategory) => {
                const transformedData = this.transformResponseData(res);
                this.echartOptions.series[0].data = transformedData;
                this.echart.setOption(this.echartOptions);
            });
    }

    transformResponseData(data: AggregateCategory): DoughnutChartData[] {
        return data.data.map((value) => {
            return { value: value.volume, name: value.dimension };
        });
    }

    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
    }
}
