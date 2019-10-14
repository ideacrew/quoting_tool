import * as $ from 'jquery'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { Routes, RouterModule } from '@angular/router'
import { AutocompleteLibModule } from 'angular-ng-autocomplete'

import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import {
  NgbDateAdapter,
  NgbDateStruct,
  NgbDateNativeAdapter,
} from '@ng-bootstrap/ng-bootstrap'
import { NgxDatatableModule } from '@swimlane/ngx-datatable'
import { TreeviewModule } from 'ngx-treeview'

import { FullComponent } from './layouts/full/full.component'
import { BlankComponent } from './layouts/blank/blank.component'

import { NavigationComponent } from './shared/header-navigation/navigation.component'
import { SidebarComponent } from './shared/sidebar/sidebar.component'
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component'

import { routes } from './app-routing.module'
import { AppComponent } from './app.component'
import { SpinnerComponent } from './shared/spinner.component'

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar'
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar'
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar'
import { EmployerDetailsComponent } from './employer-details/employer-details.component'
import { EmployerDetailsHealthComponent } from './employer-details/employer-details-health/employer-details-health.component'
import { EmployerDetailsDentalComponent } from './employer-details/employer-details-dental/employer-details-dental.component'
import { NavComponent } from './nav/nav.component'
import { PlanFilterComponent } from './plan-filter/plan-filter.component'
import { HeaderComponent } from './header/header.component'
import { FooterComponent } from './footer/footer.component'
import { DropdownTreeviewSelectComponent } from './dropdown-treeview-select/dropdown-treeview-select.component'

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 1,
  wheelPropagation: true,
  minScrollbarLength: 20,
}

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    BlankComponent,
    NavigationComponent,
    BreadcrumbComponent,
    SidebarComponent,
    EmployerDetailsComponent,
    EmployerDetailsHealthComponent,
    EmployerDetailsDentalComponent,
    NavComponent,
    PlanFilterComponent,
    HeaderComponent,
    FooterComponent,
    DropdownTreeviewSelectComponent,
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
    PerfectScrollbarModule,
    NgxDatatableModule,
    TreeviewModule.forRoot(),
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG,
    },
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
