import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { EChartsType } from 'echarts';
import { HeatmapOptions } from '../echart-options';
import { AggregateCategoryRequest } from '../../../../interfaces/requests.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { ApiService } from '../../../../services/api.service';
import * as echarts from 'echarts';
import { EchartService } from '../../../../services/echart.service';
import { Store } from '@ngrx/store';
import { HeatmapChartStateModel } from '../../../../state/echarts/echarts.model';
import { selectHeatmapChart } from '../../../../state/echarts/echarts.selectors';
import { AppState } from '../../../../state/app.state';
import { setHeatmapChartData, setHeatmapChartFilter } from '../../../../state/echarts/echarts.actions';

@Component({
    selector: 'app-heatmap',
    templateUrl: './heatmap.component.html',
    styleUrls: ['./heatmap.component.scss'],
})
export class HeatmapComponent implements AfterViewInit {
    @ViewChild('echart') echartElement!: ElementRef;
    echartData$: Observable<HeatmapChartStateModel>;
    echart!: EChartsType;
    requestBody!: AggregateCategoryRequest;
    filter!: { date: string; metrics: string };
    inputDatesForm: FormGroup = new FormGroup({
        date: new FormControl(''),
        metrics: new FormControl(''),
    });
    echartOptions = HeatmapOptions;
    maxDate: string = new Date().toISOString().slice(0, 7);
    destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private apiService: ApiService, private echartService: EchartService) {
        this.echartData$ = this.store.select(selectHeatmapChart);
        this.echartData$.subscribe(({ requestBody, data, filter, range }) => {
            this.requestBody = requestBody;
            this.filter = filter;
            this.inputDatesForm.setValue({ ...filter });
            this.echartOptions.series[0].data = data;
            this.echartOptions.visualMap.min = range.min;
            this.echartOptions.visualMap.max = range.max;
        });
    }

    ngAfterViewInit() {
        this.echart = echarts.init(this.echartElement.nativeElement);
        this.getDataFromApiAndSetToChart();

        this.inputDatesForm.valueChanges.subscribe((form: { date: string; metrics: string }) => {
            const date = new Date(form.date);
            const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
            const from = form.date + `-1`;
            const to = form.date + `-${lastDay}`;

            if (
                this.filter.date !== this.inputDatesForm.value.date ||
                this.filter.metrics !== this.inputDatesForm.value.metrics
            ) {
                this.store.dispatch(setHeatmapChartFilter({ date: form.date, from, to, metrics: form.metrics }));
                this.getDataFromApiAndSetToChart();
            }
        });
    }

    getDataFromApiAndSetToChart() {
        this.echart.showLoading();

        // Checks if we already have data to display it
        if (this.echartOptions.series[0].data[0].length > 0) {
            this.echart.setOption(this.echartOptions);
            this.echart.hideLoading();
            return;
        }
        this.apiService
            .getDataFromApi('/aggregate', this.requestBody)
            .pipe(takeUntil(this.destroyed$))
            .subscribe(
                (res) => {
                    const transformedData = this.echartService.transformHeatmapData(res);

                    this.store.dispatch(
                        setHeatmapChartData({
                            data: transformedData.data,
                            range: { min: transformedData.min, max: transformedData.max },
                        })
                    );

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
