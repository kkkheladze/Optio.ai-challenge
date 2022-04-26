import { Injectable } from '@angular/core';

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
}
