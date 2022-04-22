import { Injectable } from '@angular/core';
import { AggregateResponse } from '../interfaces/responses.interface';
import { DoughnutChartData } from '../interfaces/echart-data';
import { setDoughnutChartData, setHeatmapChartData } from '../state/echarts/echarts.actions';
import { EChartsType } from 'echarts';
import { ApiService } from './api.service';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { ECBasicOption } from 'echarts/types/dist/shared';
import { EchartType } from '../enums/echart-type';

@Injectable({
    providedIn: 'root',
})
export class EchartService {
    constructor(private apiService: ApiService, private store: Store<AppState>) {}

    transformHeatmapData(res: AggregateResponse) {
        let biggestData = 0;
        let smallestData = 0;

        // Returns modified array which contains arrays of values with it's corresponding x and y positions
        // [... , [xPos, yPos, Value]]
        const transformedArray = res.data.map((data) => {
            const d = new Date(data.dimension);
            const date = d.getDate();
            const yPos = d.getDay();
            const xPos = Math.ceil((date - 1 - yPos) / 7);

            const chartCellValue = Math.floor(data.volume || data.quantity);

            if (chartCellValue > biggestData) biggestData = chartCellValue;
            else if (chartCellValue < smallestData) smallestData = chartCellValue;

            return [xPos, yPos, chartCellValue || '-'];
        });
        return { data: transformedArray, min: smallestData, max: biggestData };
    }

    transformDoughnutChartData(res: AggregateResponse): DoughnutChartData[] {
        return res.data.map((data) => {
            return { value: data.volume, name: data.dimension };
        });
    }

    getDataFromApiAndSetToChart(echart: EChartsType, requestBody: object, echartOptions: object, type: EchartType) {
        echart.showLoading();

        this.apiService
            .getDataFromApi('/aggregate', requestBody)
            .toPromise()
            .then((res) => {
                if (type === EchartType.DOUGHNUT_CHART)
                    this.store.dispatch(setDoughnutChartData({ data: this.transformDoughnutChartData(res!) }));
                else {
                    const transformedData = this.transformHeatmapData(res!);
                    this.store.dispatch(
                        setHeatmapChartData({
                            data: transformedData.data,
                            range: {
                                min: transformedData.min,
                                max: transformedData.max,
                            },
                        })
                    );
                }
                echart.setOption(<ECBasicOption>echartOptions);
                echart.hideLoading();
            })
            .catch((error) => {
                alert(error.message);
                echart.hideLoading();
            });
    }
}
