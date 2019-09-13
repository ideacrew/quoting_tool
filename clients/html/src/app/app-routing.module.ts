import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { EmployerDetailsComponent } from './employer-details/employer-details.component';
import { EmployerDetailsHealthComponent } from './employer-details/employer-details-health/employer-details-health.component';
import { EmployerDetailsDentalComponent } from './employer-details/employer-details-dental/employer-details-dental.component';

export const routes: Routes = [
  // Boiler plate code
  /*
  {
    path: '',
    component: BlankComponent,
    children: [
      { path: '', redirectTo: '/starter', pathMatch: 'full' },
      {
        path: 'starter',
        loadChildren: () => import('./starter/starter.module').then(m => m.StarterModule)
      },
      {
        path: 'component',
        loadChildren: () => import('./component/component.module').then(m => m.ComponentsModule)
      }
    ]
  },
  */
  { path: 'employer-details', component: EmployerDetailsComponent },
  { path: 'employer-details/health', component: EmployerDetailsHealthComponent },
  { path: 'employer-details/dental', component: EmployerDetailsDentalComponent },
  { path: '', component: EmployerDetailsComponent },
  { path: '**', component: EmployerDetailsComponent }
];

export class AppRoutingModule { }
