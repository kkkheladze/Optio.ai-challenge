import { Injectable } from '@angular/core';
import { AggregateResponse, FindResponse } from '../interfaces/responses.interface';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private http: HttpClient) {}

    public getDataFromApi(endpoint: string, requestBody: any) {
        return this.http
            .post<AggregateResponse | FindResponse>(environment.OPTIO_BASE_API + `/${endpoint}`, requestBody)
            .toPromise();
    }

    // Recursive function to get the whole data from paginated server
    public async getEntireDataFromApiForLineChart(endpoint: string, requestBody: any) {
        const results = (await this.getDataFromApi(endpoint, requestBody)) as FindResponse;

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
