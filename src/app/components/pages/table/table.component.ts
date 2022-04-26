import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EchartService } from '../../../services/echart.service';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit {
    form: FormGroup;
    requestBody = {
        dimension: 'category',
        types: ['income'],
        gteDate: '2018-01-01',
        lteDate: '2018-02-31',
        sortBy: 'date',
        sortDirection: 'asc',
        pageIndex: 0,
        pageSize: 50,
        includes: ['dimension', 'date', 'volume', 'quantity', 'differenceVolume', 'differenceQuantity', 'average'],
    };
    tableData: any[] = [];
    constructor(private fb: FormBuilder, private echartService: EchartService) {
        this.form = fb.group({
            from: fb.control('2018-01-01'),
            to: fb.control('2018-01-31'),
            sortBy: fb.control('date'),
            sortDirection: fb.control('desc'),
        });
    }

    async ngOnInit() {
        const response = await this.echartService.getEntireDataFromApiForLineChart('find', this.requestBody);
        this.tableData = response.data.entities;
    }

    async getAndSetDataToState() {
        this.tableData = [];
        const { sortBy, sortDirection, from, to } = this.form.value;
        this.requestBody.sortBy = sortBy;
        this.requestBody.sortDirection = sortDirection;
        this.requestBody.gteDate = from;
        this.requestBody.lteDate = to;

        const response = await this.echartService.getEntireDataFromApiForLineChart('find', this.requestBody);
        this.tableData = response.data.entities;
    }
}
