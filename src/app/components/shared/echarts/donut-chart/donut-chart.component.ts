import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { EChartsType } from 'echarts';
import { AggregateCategoryRequest } from '../../../../interfaces/requests.interface';
import { DoughnutOptions } from '../echart-options';
import { ApiService } from '../../../../services/api.service';
import { Observable, ReplaySubject, takeUntil } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { EchartService } from '../../../../services/echart.service';
import { Store } from '@ngrx/store';
import { selectDoughnutChart } from '../../../../state/echarts/echarts.selectors';
import { AppState } from '../../../../state/app.state';
import { DoughnutChartStateModel } from '../../../../state/echarts/echarts.model';
import { setDoughnutChartData, setDoughnutChartFilter } from '../../../../state/echarts/echarts.actions';

@Component({
    selector: 'app-donut-chart',
    templateUrl: './donut-chart.component.html',
    styleUrls: ['./donut-chart.component.scss'],
})
export class DonutChartComponent implements AfterViewInit, OnDestroy {
    @ViewChild('echart') echartElement!: ElementRef;
    public echartData$: Observable<DoughnutChartStateModel>;
    echart!: EChartsType;
    requestBody!: AggregateCategoryRequest;
    inputDatesForm: FormGroup = new FormGroup({
        from: new FormControl('2018-01-01'),
        to: new FormControl('2018-01-31'),
    });
    echartOptions = DoughnutOptions;

    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private store: Store<AppState>, private apiService: ApiService, private echartService: EchartService) {
        this.echartData$ = this.store.select(selectDoughnutChart);
        this.echartData$.subscribe(({ data, requestBody }) => {
            this.echartOptions.series[0].data = data;
            this.requestBody = requestBody;
        });
    }

    ngAfterViewInit() {
        this.echart = echarts.init(this.echartElement.nativeElement);
        this.inputDatesForm.valueChanges.subscribe(({ from, to }) => {
            this.store.dispatch(setDoughnutChartFilter({ from, to }));
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
                    this.store.dispatch(
                        setDoughnutChartData({ data: this.echartService.transformDoughnutChartData(res) })
                    );
                    this.echart.setOption(this.echartOptions);
                    this.echart.hideLoading();
                },
                (error) => {
                    alert(error.message);
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
