import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { EChartsType } from 'echarts';
import { HttpClient } from '@angular/common/http';
import { AggregateCategoryResponse } from '../../../../interfaces/responses.interface';
import { AggregateCategoryRequest } from '../../../../interfaces/requests.interface';
import { DoughnutOptions } from '../echart-options';
import { ApiService } from '../../../../services/api.service';
import { DoughnutChartData } from '../../../../interfaces/echart-data';
import { ReplaySubject, takeUntil } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-donut-chart',
    templateUrl: './donut-chart.component.html',
    styleUrls: ['./donut-chart.component.scss'],
})
export class DonutChartComponent implements AfterViewInit, OnDestroy {
    @ViewChild('echart') echartElement!: ElementRef;
    echart!: EChartsType;
    echartOptions = DoughnutOptions;
    inputDatesForm: FormGroup = new FormGroup({
        from: new FormControl('2018-01-01'),
        to: new FormControl('2018-01-31'),
    });
    requestBody: AggregateCategoryRequest = {
        dimension: 'parent-category',
        types: ['spending', 'withdrawal'],
        gteDate: this.inputDatesForm.value.from,
        lteDate: this.inputDatesForm.value.to,
        includeMetrics: ['volume'],
    };
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private http: HttpClient, private apiService: ApiService) {}

    ngAfterViewInit() {
        this.echart = echarts.init(this.echartElement.nativeElement);
        this.inputDatesForm.valueChanges.pipe(takeUntil(this.destroyed$)).subscribe((changedValue) => {
            this.requestBody.gteDate = changedValue.from;
            this.requestBody.lteDate = changedValue.to;
        });
        this.getDataFromApiAndSetToChart();
    }

    getDataFromApiAndSetToChart() {
        this.echart.showLoading();
        this.apiService
            .getDataFromApi('/aggregate', this.requestBody)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(
                (res) => {
                    this.echartOptions.series[0].data = this.transformResponseData(res);
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