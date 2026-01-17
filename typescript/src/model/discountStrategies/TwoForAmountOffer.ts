import { Discount } from "../Discount";
import { PricedProductQuantity } from "../PricedProductQuantity";
import { DiscountStrategy } from "./DiscountStrategy";

export class TwoForAmountOffer implements DiscountStrategy {
    private readonly requiredQuantity = 2;

    constructor(private readonly amount: number) {}

    getDiscount(pricedProductQuantity: PricedProductQuantity): Discount | null {
        const { product, quantity, unitPrice, totalPrice } = pricedProductQuantity;

        if (quantity < this.requiredQuantity) {
            return null;
        }

        const numberOfPairs = Math.floor(quantity / this.requiredQuantity);
        const remainder = quantity % this.requiredQuantity;

        // Pay fixed amount for each pair, plus any remainder at full price
        const discountedPrice = (numberOfPairs * this.amount) + (remainder * unitPrice);
        const discountAmount = totalPrice - discountedPrice;

        return new Discount(product, "2 for " + this.amount, discountAmount);
    }
}
