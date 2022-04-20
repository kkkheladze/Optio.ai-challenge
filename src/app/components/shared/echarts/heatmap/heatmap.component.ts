import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { EChartsType } from 'echarts';
import { HeatmapOptions } from '../echart-options';
import { AggregateCategoryRequest } from '../../../../interfaces/requests.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, Subscription, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../../services/api.service';
import * as echarts from 'echarts';
import { AggregateCategoryResponse } from '../../../../interfaces/responses.interface';
import { DoughnutChartData } from '../../../../interfaces/echart-data';

@Component({
    selector: 'app-heatmap',
    templateUrl: './heatmap.component.html',
    styleUrls: ['./heatmap.component.scss'],
})
export class HeatmapComponent implements AfterViewInit {
    @ViewChild('echart') echartElement!: ElementRef;
    echart!: EChartsType;
    echartOptions = HeatmapOptions;
    inputDatesForm: FormGroup = new FormGroup({
        date: new FormControl('2018-01'),
        metrics: new FormControl('volume'),
    });
    requestBody: AggregateCategoryRequest = {
        dimension: 'date',
        types: ['spending', 'withdrawal'],
        gteDate: this.inputDatesForm.value.date + '-01',
        lteDate: this.inputDatesForm.value.date + '-31',
        includeMetrics: [this.inputDatesForm.value.metrics],
    };
    maxDate: string = new Date().toISOString().slice(0, 7);

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private http: HttpClient, private apiService: ApiService) {}

    ngAfterViewInit() {
        this.echart = echarts.init(this.echartElement.nativeElement);
        this.inputDatesForm.valueChanges
            .pipe(takeUntil(this.destroyed$))
            .subscribe((form: { date: string; metrics: string }) => {
                const date = new Date(form.date);
                const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDate();
                const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
                console.log(firstDay, lastDay);
                this.requestBody.gteDate = form.date + `-${firstDay}`;
                this.requestBody.lteDate = form.date + `-${lastDay}`;
                this.requestBody.includeMetrics = [form.metrics];
            });
        this.getDataFromApiAndSetToChart();
    }

    getDataFromApiAndSetToChart() {
        this.echart.showLoading();
        console.log(this.requestBody);
        this.apiService
            .getDataFromApi('/aggregate', this.requestBody)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(
                (res) => {
                    const transformedData = this.transformResponseData(res);
                    this.echartOptions.series[0].data = transformedData.data;
                    this.echartOptions.visualMap.min = transformedData.min;
                    this.echartOptions.visualMap.max = transformedData.max;
                    this.echart.setOption(this.echartOptions);
                    this.echart.hideLoading();
                },
                (error) => {
                    alert(error);
                    this.echart.hideLoading();
                }
            );
    }

    transformResponseData(data: AggregateCategoryResponse) {
        let biggestData = 0;
        let smallestData = 0;
        const newArray = data.data.map((value) => {
            const d = new Date(value.dimension);
            const date = d.getDate();
            const y = d.getDay();
            const x = Math.ceil((date - 1 - y) / 7);
            const chartVal = Math.floor(value.volume) || Math.floor(value.quantity);
            if (chartVal > biggestData) biggestData = chartVal;
            else if (chartVal < smallestData) smallestData = chartVal;
            return [y, x, chartVal];
        });
        const transformForChart = newArray.map(function (item) {
            return [item[1], item[0], item[2] || '-'];
        });
        return { data: transformForChart, min: smallestData, max: biggestData };
    }

    // Without this echart canvas is not resizing on the viewport change.
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.echart.resize();
    }
    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.unsubscribe();
    }
}
