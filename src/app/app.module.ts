import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { TableComponent } from './components/pages/table/table.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { NavComponent } from './components/nav/nav.component';
import { HttpClientModule } from '@angular/common/http';
import { DonutChartComponent } from './components/shared/echarts/donut-chart/donut-chart.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { HeatmapComponent } from './components/shared/echarts/heatmap/heatmap.component';
import { StoreModule } from '@ngrx/store';
import { echartsReducer } from './state/echarts/echarts.reducer';

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        TableComponent,
        NotFoundComponent,
        NavComponent,
        DonutChartComponent,
        HeatmapComponent,
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        NgbModule,
        StoreModule.forRoot({ echarts: echartsReducer }),
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
