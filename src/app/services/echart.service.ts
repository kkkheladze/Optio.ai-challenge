import { Injectable } from '@angular/core';
import { AggregateResponse, FindResponse } from '../interfaces/responses.interface';
import { DoughnutChartData, LineChartData } from '../interfaces/echart-data';
import { setDoughnutChartData, setHeatmapChartData, setLineChartData } from '../state/dashboard/dashboard.actions';
import { EChartsType } from 'echarts';
import { ApiService } from './api.service';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { ECBasicOption } from 'echarts/types/dist/shared';
import { EchartType } from '../enums/echart-type';
import { FormGroup } from '@angular/forms';

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

    transformLineChartData(res: FindResponse) {
        const categories = res.data.entities.map((entity) => {
            return entity.dimension;
        });
        const uniqueCategories = new Set(categories);
        const transformedData: LineChartData[] = [];

        for (let category of uniqueCategories) {
            const data: LineChartData = { name: category, smooth: true, type: 'line', data: [] };
            res.data.entities.forEach((entity) => {
                if (entity.dimension === category) {
                    data.data.push(Math.floor(entity.volume));
                }
            });
            transformedData.push(data);
        }
        return transformedData;
    }

    async getDataFromApiAndSetToChart(
        echart: EChartsType,
        requestBody: any,
        echartOptions: object,
        type: EchartType,
        endpoint: string
    ) {
        echart.showLoading();
        let dataFromApi: any;

        if (type === EchartType.LINE_CHART) {
            dataFromApi = await this.getEntireDataFromApiForLineChart(endpoint, requestBody);
        } else {
            dataFromApi = await this.apiService.getDataFromApi(endpoint, requestBody);
        }

        try {
            this.setDataToState(type, dataFromApi!);
        } catch (e) {
            alert(e);
            echart.hideLoading();
        }

        echart.setOption(<ECBasicOption>echartOptions);
        echart.hideLoading();
    }

    setDataToState(type: EchartType, res: AggregateResponse | FindResponse) {
        switch (type) {
            case EchartType.DOUGHNUT_CHART:
                const transformedDoughnutData = this.transformDoughnutChartData(res as AggregateResponse);
                this.store.dispatch(setDoughnutChartData({ data: transformedDoughnutData }));
                break;

            case EchartType.HEATMAP_CHART:
                const transformedHeatmapData = this.transformHeatmapData(res as AggregateResponse);
                this.store.dispatch(
                    setHeatmapChartData({
                        data: transformedHeatmapData.data,
                        range: {
                            min: transformedHeatmapData.min,
                            max: transformedHeatmapData.max,
                        },
                    })
                );
                break;

            case EchartType.LINE_CHART:
                const transformedLineData = this.transformLineChartData(res as FindResponse);
                this.store.dispatch(setLineChartData({ data: transformedLineData }));

                break;

            default:
                break;
        }
    }

    getFirstAndLastDayOfMonth(form: FormGroup) {
        const formValue = form.value;
        const date = new Date(formValue.date);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const from = formValue.date + `-1`;
        const to = formValue.date + `-${lastDay}`;

        return { from, to };
    }

    // Recursive function to get the whole data from paginated server
    async getEntireDataFromApiForLineChart(endpoint: string, requestBody: any) {
        const results = (await this.apiService.getDataFromApi(endpoint, requestBody)) as FindResponse;

        if (results.data.entities.length > 0) {
            const newBody = JSON.parse(JSON.stringify(requestBody));
            newBody.pageIndex = requestBody.pageIndex + 1;
            const res = (await this.getEntireDataFromApiForLineChart(endpoint, newBody)) as FindResponse;

            res.data.entities.forEach((entity: any) => {
                results.data.entities.push(entity);
            });
            return results;
        } else {
            return results;
        }
    }
}
