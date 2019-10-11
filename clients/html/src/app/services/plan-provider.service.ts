import { Injectable } from '@angular/core';
import { ProductDataLoader } from './product-data-loader.service';
import { Product } from '../data/products';
import { ProductData } from '../data/products';
import { ApiRequestService } from './api-request.service';

interface ProductListUser {
  onProductsLoaded(products: Array<Product>): void;
}

@Injectable({
  providedIn: 'root'
})
export class PlanProviderService {
  public dataLoader: ProductDataLoader;

  constructor(private api_request: ApiRequestService) {
    this.dataLoader = new ProductDataLoader();
  }

  public getPlansFor(
    consumer: ProductListUser,
    sic_code: string,
    startDate: Date,
    state: string,
    county_name: string,
    zip: string) {
    const formattedDate = startDate.toISOString().substring(0, 10);
    const transformer = this.dataLoader;
    const attrs = {
      sic_code: sic_code,
      start_date: formattedDate,
      county_name: county_name,
      zip_code: zip,
      state: state
    };
    this.api_request.authedGet('employees/get_plans.json', attrs).subscribe(function(data: Array<ProductData>) {
      consumer.onProductsLoaded(transformer.castData(data['plans']));
    });
  }
}
