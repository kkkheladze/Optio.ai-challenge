import { createReducer, on } from '@ngrx/store';
import {
    setDoughnutChartData,
    setDoughnutChartFilter,
    setHeatmapChartData,
    setHeatmapChartFilter,
} from './echarts.actions';
import { EchartsStateModel } from './echarts.model';

export const initialState: EchartsStateModel = {
    DoughnutChart: {
        data: [],
        filter: {
            from: '2018-01-01',
            to: '2018-01-31',
        },
        requestBody: {
            dimension: 'parent-category',
            types: ['spending', 'withdrawal'],
            gteDate: '2018-01-01',
            lteDate: '2018-01-31',
            includeMetrics: ['volume'],
        },
    },
    HeatmapChart: {
        data: [[]],
        range: {
            min: 0,
            max: 10,
        },
        filter: {
            date: '2018-01',
            metrics: 'quantity',
        },
        requestBody: {
            dimension: 'date',
            types: ['spending', 'withdrawal'],
            gteDate: '2018-01-01',
            lteDate: '2018-01-31',
            includeMetrics: ['quantity'],
        },
    },
};

export const echartsReducer = createReducer(
    initialState,
    on(setDoughnutChartFilter, (state, { from, to }) => ({
        ...state,
        DoughnutChart: {
            ...state.DoughnutChart,
            filter: {
                from,
                to,
            },
            requestBody: {
                ...state.DoughnutChart.requestBody,
                gteDate: from,
                lteDate: to,
            },
        },
    })),
    on(setDoughnutChartData, (state, { data }) => ({
        ...state,
        DoughnutChart: {
            ...state.DoughnutChart,
            data,
        },
    })),

    on(setHeatmapChartFilter, (state, { date, metrics, from, to }) => ({
        ...state,
        HeatmapChart: {
            ...state.HeatmapChart,
            filter: {
                date,
                metrics,
            },
            requestBody: {
                ...state.HeatmapChart.requestBody,
                includeMetrics: [metrics],
                gteDate: from,
                lteDate: to,
            },
        },
    })),
    on(setHeatmapChartData, (state, { data, range }) => ({
        ...state,
        HeatmapChart: {
            ...state.HeatmapChart,
            data,
            range,
        },
    }))
);
