import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { EChartsType } from 'echarts';
import { HttpClient } from '@angular/common/http';
import { AggregateCategoryResponse } from '../../../../interfaces/responses.interface';
import { AggregateCategoryRequest } from '../../../../interfaces/requests.interface';
import { DoughnutOptions } from '../shared/echart-options';
import { ApiService } from '../../../../services/api.service';
import { DoughnutChartData } from '../../../../interfaces/echart-data';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-donut-chart',
    templateUrl: './donut-chart.component.html',
    styleUrls: ['./donut-chart.component.scss'],
})
export class DonutChartComponent implements AfterViewInit, OnDestroy {
    @ViewChild('echart') echartElement!: ElementRef;
    echart!: EChartsType;
    echartOptions = DoughnutOptions;
    requestBody!: AggregateCategoryRequest;
    inputDatesForm: FormGroup = new FormGroup({
        from: new FormControl('2018-01-01'),
        to: new FormControl('2018-01-31'),
    });
    subscription!: Subscription;

    constructor(private http: HttpClient, private apiService: ApiService) {}

    ngAfterViewInit() {
        this.echart = echarts.init(this.echartElement.nativeElement);
        this.getDataFromApiAndSetToChart();
    }

    getDataFromApiAndSetToChart() {
        this.editRequestBody();
        this.echart.showLoading();
        this.subscription = this.apiService.getDataFromApi('/aggregate', this.requestBody).subscribe(
            (res) => {
                const transformedData = this.transformResponseData(res);
                this.echartOptions.series[0].data = transformedData;
                this.echart.setOption(this.echartOptions);
                this.echart.hideLoading();
            },
            (error) => {
                alert(error);
                this.echart.hideLoading();
            }
        );
    }

    transformResponseData(data: AggregateCategoryResponse): DoughnutChartData[] {
        return data.data.map((value) => {
            return { value: value.volume, name: value.dimension };
        });
    }

    editRequestBody() {
        this.requestBody = {
            dimension: 'parent-category',
            types: ['spending', 'withdrawal'],
            gteDate: this.inputDatesForm.value.from,
            lteDate: this.inputDatesForm.value.to,
            includeMetrics: ['volume'],
        };
    }

    ngOnDestroy() {
        if (this.subscription) this.subscription.unsubscribe();
    }

    // Without this echart canvas is not resizing on the viewport change.
    @HostListener('window:resize', ['$event'])
    onResize(event: any) {
        this.echart.resize();
    }
}
