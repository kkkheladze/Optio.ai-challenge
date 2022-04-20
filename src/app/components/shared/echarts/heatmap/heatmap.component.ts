import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { EChartsType } from 'echarts';
import { HeatmapOptions } from '../echart-options';
import { AggregateCategoryRequest } from '../../../../interfaces/requests.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { ReplaySubject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../../services/api.service';
import * as echarts from 'echarts';
import { EchartService } from '../../../../services/echart.service';

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

    constructor(private http: HttpClient, private apiService: ApiService, private echartService: EchartService) {}

    ngAfterViewInit() {
        this.echart = echarts.init(this.echartElement.nativeElement);
        this.inputDatesForm.valueChanges
            .pipe(takeUntil(this.destroyed$))
            .subscribe((form: { date: string; metrics: string }) => {
                const date = new Date(form.date);
                const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

                this.requestBody.gteDate = form.date + `-1`;
                this.requestBody.lteDate = form.date + `-${lastDay}`;
                this.requestBody.includeMetrics = [form.metrics];

                this.getDataFromApiAndSetToChart();
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
                    const transformedData = this.echartService.transformHeatmapData(res);

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

    // Without this echart canvas is not resizing on the viewport change.
    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        this.echart.resize();
        event.preventDefault();
    }
    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.unsubscribe();
    }
}
