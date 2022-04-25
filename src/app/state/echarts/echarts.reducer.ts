import { createReducer, on } from '@ngrx/store';
import {
    setDoughnutChartData,
    setDoughnutChartFilter,
    setHeatmapChartData,
    setHeatmapChartFilter,
    setLineChartData,
    setLineChartFilter,
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
    LineChart: {
        data: [],
        filter: {
            from: '2018-01-01',
            to: '2018-01-31',
        },
        requestBody: {
            dimension: 'category',
            types: ['income'],
            gteDate: '2018-01-01',
            lteDate: '2018-01-31',
            sortBy: 'date',
            sortDirection: 'asc',
            pageIndex: 0,
            pageSize: 50,
            includes: ['dimension', 'date', 'volume'],
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
    })),
    on(setLineChartFilter, (state, { from, to }) => ({
        ...state,
        LineChart: {
            ...state.LineChart,
            filter: {
                from,
                to,
            },
            requestBody: {
                ...state.LineChart.requestBody,
                gteDate: from,
                lteDate: to,
            },
        },
    })),
    on(setLineChartData, (state, { data }) => ({
        ...state,
        LineChart: {
            ...state.LineChart,
            data: data,
        },
    }))
);
