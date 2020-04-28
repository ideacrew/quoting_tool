import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { AppComponent } from './app.component';

import { EmployerDetailsHealthComponent } from './employer-details/employer-details-health/employer-details-health.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SharedModule } from './shared/shared.module';
import { EmployerDetailsDentalComponent } from './employer-details/employer-details-dental/employer-details-dental.component';
import { DentalModule } from './employer-details/employer-details-dental/dental.module';
import { HealthModule } from './employer-details/employer-details-health/health.module';

const routes: Routes = [
  {
    path: 'employer-details',
    loadChildren: () => import('./employer-details/employer-details.module').then((m) => m.EmployerDetailsModule)
  },
  {
    path: 'employer-details/health',
    loadChildren: () => import('./employer-details/employer-details-health/health.module').then((m) => m.HealthModule)
  },
  {
    path: 'employer-details/dental',
    loadChildren: () => import('./employer-details/employer-details-dental/dental.module').then((m) => m.DentalModule)
  },
  {
    path: '',
    redirectTo: 'employer-details',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'employer-details'
  }
];

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    RouterModule.forRoot(routes),
    SweetAlert2Module.forRoot(),
    SharedModule,
    DentalModule,
    HealthModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
