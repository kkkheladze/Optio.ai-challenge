import { Injectable } from '@angular/core';
import { AggregateResponse, FindResponse } from '../interfaces/responses.interface';
import { setDoughnutChartData, setHeatmapChartData, setLineChartData } from '../state/dashboard/dashboard.actions';
import { ApiService } from './api.service';
import { Store } from '@ngrx/store';
import { AppState } from '../state/app.state';
import { UtilsService } from './utils.service';

@Injectable({
    providedIn: 'root',
})
export class EchartService {
    constructor(private apiService: ApiService, private store: Store<AppState>, private utilsService: UtilsService) {}

    setDoughnutDataToState(data: AggregateResponse) {
        const transformedDoughnutData = this.utilsService.transformDoughnutChartData(data);
        this.store.dispatch(setDoughnutChartData({ data: transformedDoughnutData }));
    }

    setHeatmapDataToState(data: AggregateResponse) {
        const transformedHeatmapData = this.utilsService.transformHeatmapData(data);
        this.store.dispatch(
            setHeatmapChartData({
                data: transformedHeatmapData.data,
                range: {
                    min: transformedHeatmapData.min,
                    max: transformedHeatmapData.max,
                },
            })
        );
    }

    setLineDataToState(data: FindResponse) {
        const transformedLineData = this.utilsService.transformLineChartData(data);
        this.store.dispatch(setLineChartData({ data: transformedLineData }));
    }
}
