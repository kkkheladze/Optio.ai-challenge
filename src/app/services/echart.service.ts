import { Injectable } from '@angular/core';
import { AggregateCategoryResponse } from '../interfaces/responses.interface';
import { DoughnutChartData } from '../interfaces/echart-data';

@Injectable({
    providedIn: 'root',
})
export class EchartService {
    constructor() {}

    transformHeatmapData(res: AggregateCategoryResponse) {
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

    transformDoughnutChartData(res: AggregateCategoryResponse): DoughnutChartData[] {
        return res.data.map((data) => {
            return { value: data.volume, name: data.dimension };
        });
    }
}
