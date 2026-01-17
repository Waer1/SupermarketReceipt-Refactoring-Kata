import {Product} from "./Product"
import { ProductUnit } from "./ProductUnit";

export class ReceiptItem {

    public constructor(public readonly product: Product,
                       public readonly quantity: number,
                       public readonly price: number,
                       public totalPrice: number) {
    }


    getFormatedTotalPrice(): string {
        return this.format2Decimals(this.totalPrice);
    }

    getFormatedQuantity(): string {
        return this.presentQuantity();
    }

    format2Decimals(number: number) {
        return new Intl.NumberFormat('en-UK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number)
    }

    presentQuantity(): string  {
            return ProductUnit.Each == this.product.unit
                // TODO make sure this is the simplest way to make something similar to the java version
                    ? new Intl.NumberFormat('en-UK', {maximumFractionDigits: 0}).format(this.quantity)
                    : new Intl.NumberFormat('en-UK', {minimumFractionDigits: 3}).format(this.quantity);
        }
}
