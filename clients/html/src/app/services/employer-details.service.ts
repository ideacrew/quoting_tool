import { Injectable } from '@angular/core';
import { ApiRequestService } from './api-request.service';

@Injectable({
  providedIn: 'root'
})
export class EmployerDetailsService {

  constructor(private api_request: ApiRequestService) { }

  postUpload(upload)  {
    return this.api_request.authedPost('employees/upload.json', upload);
  }

}
