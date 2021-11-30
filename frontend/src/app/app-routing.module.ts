import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {BusinessesComponent} from "./businesses/businesses.component";
import {BusinessComponent} from "./business/business.component";
import {InsightsComponent} from "./insights/insights.component";

const appRoutes: Routes = [
  {path: '', redirectTo: '/', pathMatch: 'full'},
  {path: '', component: BusinessesComponent},
  {path: 'businesses', component: BusinessesComponent},
  {path: 'business/:id', component: BusinessComponent},
  {path: 'insights', component: InsightsComponent}
];

@NgModule({
  declarations: [],
  imports: [
    [RouterModule.forRoot(appRoutes)],
    CommonModule
  ]
})
export class AppRoutingModule {
}
