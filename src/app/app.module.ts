import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { TableComponent } from './components/pages/table/table.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { NavComponent } from './components/nav/nav.component';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { echartsReducer } from './state/echarts/echarts.reducer';
import { environment } from '../environments/environment';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EchartComponent } from './components/shared/echart/echart.component';
import { TableChartComponent } from './components/shared/table-chart/table-chart.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TableModule } from 'primeng/table';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        TableComponent,
        NotFoundComponent,
        NavComponent,
        EchartComponent,
        TableChartComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        NgbModule,
        StoreModule.forRoot({ echarts: echartsReducer }),
        StoreDevtoolsModule.instrument({ name: 'Optio.ai Challenge', maxAge: 25, logOnly: environment.production }),
        TableModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
