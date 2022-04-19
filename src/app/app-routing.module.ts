import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { TableComponent } from './components/pages/table/table.component';

const routes: Routes = [
    { path: '/', component: DashboardComponent, pathMatch: 'full' },
    { path: '/dashboard', component: DashboardComponent },
    { path: '/table', component: TableComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
