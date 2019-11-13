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
    zip: string,
    kind: string,
    component
  ) {
    const transformer = this.dataLoader;
    const attrs = {
      sic_code: sic_code,
      start_date: startDate,
      county_name: county_name,
      zip_code: zip,
      state: state,
      kind: kind
    };
    this.api_request.authedGet('products/plans.json', attrs).subscribe(function(data: Array<ProductData>) {
      consumer.onProductsLoaded(transformer.castData(data['plans']));
      component.isLoading = false;
    });
  }

  public getSbcDocumentFor(key, win) {
    this.api_request.authedGet('products/sbc_document.json', {key: key}).subscribe(response => {
      if (response['status'] === 'success') {
        var objbuilder = '';
        objbuilder += ('<object width="100%" height="100%"      data="data:application/pdf;base64,');
        objbuilder += (response["metadata"][1]);
        objbuilder += ('" type="application/pdf" class="internal">');
        objbuilder += ('<embed src="data:application/pdf;base64,');
        objbuilder += (response["metadata"][1]);
        objbuilder += ('" type="application/pdf" />');
        objbuilder += ('</object>');
        win.document.title = "Sbc Document";
        win.document.write('<html><body>');
        win.document.write(objbuilder);
        win.document.write('</body></html>');
        // window.open("data:application/pdf;base64,"+response["metadata"][1])
        // const pdfWindow = window.open('');
        // pdfWindow.document.write(`<iframe width='100%' height='100%' src='data:application/pdf;base64, ${encodeURI(response['metadata'][1])}></iframe>`);
      }
    });
  }
}
