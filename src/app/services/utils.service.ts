import { Injectable } from '@angular/core';
import { AggregateResponse, FindResponse } from '../interfaces/responses.interface';
import { DoughnutChartData, LineChartData } from '../interfaces/echart-data';

@Injectable({
    providedIn: 'root',
})
export class UtilsService {
    constructor() {}

    getFirstAndLastDayOfMonth(dateString: string) {
        const date = new Date(dateString);
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
        const from = dateString + `-01`;
        const to = dateString + `-${lastDay}`;

        return { from, to };
    }

    getRequestBodyBasedOnSelectedChart(chart: string) {
        switch (chart) {
            case 'spendingCategory':
                return {
                    dimension: 'parent-category',
                    types: ['spending', 'withdrawal'],
                };
            case 'spendingHeatmap':
                return {
                    dimension: 'date',
                    types: ['spending', 'withdrawal'],
                };
            case 'incomeDynamics':
                return {
                    dimension: 'category',
                    types: ['income'],
                };
            default:
                return null;
        }
    }

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
}
