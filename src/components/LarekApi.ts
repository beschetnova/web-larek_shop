import { IOrder, IProduct } from "../types";
import { Api, ApiListResponse} from "./base/api";

export class LarekApi extends Api {
  cdn: string;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
    super(baseUrl, options)
    this.cdn = cdn;
  }

  getProducts() {
    return this.get('/product')
      .then((data: ApiListResponse<IProduct>) => {
        return data.items.map((item) => ({ ...item }))
      })
  }

  makeOrder(order: IOrder): Promise<IOrder> {
		return this.post('/order', order).then((data: IOrder) => data);
	}
}