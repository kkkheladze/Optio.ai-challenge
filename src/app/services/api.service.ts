import { Injectable } from '@angular/core';
import { AggregateCategoryResponse } from '../interfaces/responses.interface';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private http: HttpClient) {}

    public getDataFromApi(endpoint: string, requestBody: any) {
        return this.http.post<AggregateCategoryResponse>(environment.OPTIO_BASE_API + endpoint, requestBody);
    }
}
