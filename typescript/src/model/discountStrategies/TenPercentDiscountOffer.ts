import { Discount } from "../Discount";
import { PricedProductQuantity } from "../PricedProductQuantity";
import { DiscountStrategy } from "./DiscountStrategy";

export class TenPercentDiscountOffer implements DiscountStrategy {
    constructor(private readonly percentage: number) {}

    getDiscount(pricedProductQuantity: PricedProductQuantity): Discount | null {
        const { product, quantity, unitPrice } = pricedProductQuantity;

        const discountAmount = quantity * unitPrice * this.percentage / 100.0;

        return new Discount(product, this.percentage + "% off", discountAmount);
    }
}
