import { Injectable } from '@angular/core';
import { ApiRequestService } from './api-request.service';

@Injectable({
  providedIn: 'root'
})
export class SampleService {

  constructor(private api_request: ApiRequestService) { }

  // Gets the message from the Rails backend
  getMessage()  {
    return this.api_request.authedGet('samples');
  }
}
