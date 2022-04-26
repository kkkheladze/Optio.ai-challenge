import { TableStateModel } from './table.model';
import { createReducer, on } from '@ngrx/store';
import { setTableData, setTableFilter } from './table.actions';

export const initialState: TableStateModel = {
    filter: {
        from: '2018-01-01',
        to: '2018-01-31',
        sortBy: 'date',
        sortDirection: 'asc',
        fromChart: 'spendingCategory',
    },
    data: [],
    requestBody: {
        gteDate: '2018-01-01',
        lteDate: '2018-01-31',
        sortBy: 'date',
        sortDirection: 'asc',
        pageIndex: 0,
        pageSize: 50,
        includes: ['dimension', 'date', 'volume', 'quantity', 'differenceVolume', 'differenceQuantity', 'average'],
    },
};

export const tableReducer = createReducer(
    initialState,
    on(setTableFilter, (state, { from, to, fromChart, sortBy, sortDirection, requestBody }) => ({
        ...state,
        filter: {
            ...state.filter,
            from,
            to,
            sortBy,
            sortDirection,
            fromChart,
        },
        requestBody,
    })),
    on(setTableData, (state, { data }) => ({
        ...state,
        data,
    }))
);
