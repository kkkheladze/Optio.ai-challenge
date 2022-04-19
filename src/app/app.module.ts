import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { TableComponent } from './components/pages/table/table.component';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { NavComponent } from './components/nav/nav.component';

@NgModule({
    declarations: [AppComponent, DashboardComponent, TableComponent, NotFoundComponent, NavComponent],
    imports: [BrowserModule, AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
