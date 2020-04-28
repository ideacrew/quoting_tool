import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDateAdapter, NgbDateNativeAdapter, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EmployerDetailsDentalComponent } from './employer-details-dental.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [EmployerDetailsDentalComponent],
  imports: [CommonModule, NgbModule, SharedModule],
  exports: [EmployerDetailsDentalComponent]
  // providers: [{ provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }]
})
export class DentalModule {}
