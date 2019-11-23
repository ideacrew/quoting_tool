import * as $ from 'jquery';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateAdapter, NgbDateStruct, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { TreeviewModule } from 'ngx-treeview';

import { routes } from './app-routing.module';
import { AppComponent } from './app.component';

import { EmployerDetailsComponent } from './employer-details/employer-details.component';
import { EmployerDetailsHealthComponent } from './employer-details/employer-details-health/employer-details-health.component';
import { EmployerDetailsDentalComponent } from './employer-details/employer-details-dental/employer-details-dental.component';
import { NavComponent } from './nav/nav.component';
import { PlanFilterComponent } from './plan-filter/plan-filter.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DropdownTreeviewSelectComponent } from './dropdown-treeview-select/dropdown-treeview-select.component';
import { PlanFilterPipe } from './plan-filter/plan-filter.pipe';
import { OrderByPipe } from './plan-filter/order-by.pipe';
import { CoverageTypePipe } from './employer-details/coverage-type.pipe';


@NgModule({
  declarations: [
    AppComponent,
    EmployerDetailsComponent,
    EmployerDetailsHealthComponent,
    EmployerDetailsDentalComponent,
    NavComponent,
    PlanFilterComponent,
    HeaderComponent,
    FooterComponent,
    DropdownTreeviewSelectComponent,
    PlanFilterPipe,
    OrderByPipe,
    CoverageTypePipe
  ],
  imports: [
    AutocompleteLibModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot(routes),
    NgxDatatableModule,
    SweetAlert2Module.forRoot(),
    TreeviewModule.forRoot()
  ],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
