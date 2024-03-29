import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpClientModule} from '@angular/common/http'; // add http client module

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {BusinessesComponent} from './businesses/businesses.component';
import {MatIconModule} from "@angular/material/icon";
import {MatToolbar, MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatCardModule} from "@angular/material/card";
import {MatMenuModule} from "@angular/material/menu";
import {AppRoutingModule} from './app-routing.module';
import {RouterModule} from "@angular/router";
import {BusinessComponent} from './business/business.component';
import {ReviewComponent} from './review/review.component';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatFormFieldControl} from "@angular/material/form-field";
import {MatSlider, MatSliderModule} from "@angular/material/slider";
import { MatPaginatorModule } from '@angular/material/paginator'; 
import { NgImageSliderModule } from 'ng-image-slider';
import { InsightsComponent } from './insights/insights.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatListModule} from "@angular/material/list";





@NgModule({
  declarations: [
    AppComponent,
    BusinessesComponent,
    BusinessComponent,
    ReviewComponent,
    InsightsComponent
  ],
  imports: [
    NgImageSliderModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatToolbarModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatMenuModule,
    MatIconModule,
    MatTabsModule,
    MatListModule,
    AppRoutingModule,
    RouterModule,
    MatDialogModule,
    FormsModule,
    MatSliderModule,
    MatPaginatorModule
  ],
  providers: [MatDialog],
  bootstrap: [AppComponent]
})
export class AppModule {
}
