import {Discount} from "./Discount"
import { PricedProductQuantity } from "./PricedProductQuantity";
import {Product} from "./Product"
import {ReceiptItem} from "./ReceiptItem"
import * as _ from "lodash"

export class Receipt {
    private items: ReceiptItem[] = [];
    private discounts: Discount[] = [];

    public getTotalPrice(): number {
        let total = 0.0;
        for (let item of this.items) {
            total += item.totalPrice;
        }
        for ( let discount of this.discounts) {
            total -= discount.discountAmount;
        }
        return total;
    }

    public addProduct(pricedProductQuantity: PricedProductQuantity): void {
        this.items.push(new ReceiptItem(pricedProductQuantity.product, pricedProductQuantity.quantity, pricedProductQuantity.unitPrice, pricedProductQuantity.totalPrice));
    }

    public getItems(): ReceiptItem[] {
        return _.clone(this.items);
    }

    public addDiscount( discount: Discount): void {
        this.discounts.push(discount);
    }

    public getDiscounts(): Discount[] {
        return this.discounts;
    }
}
