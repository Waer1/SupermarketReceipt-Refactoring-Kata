import { Discount } from "../Discount";
import { PricedProductQuantity } from "../PricedProductQuantity";
import { DiscountStrategy } from "./DiscountStrategy";

export class FiveForAmountOffer implements DiscountStrategy {
    private readonly requiredQuantity = 5;

    constructor(private readonly amount: number) {}

    getDiscount(pricedProductQuantity: PricedProductQuantity): Discount | null {
        const { product, quantity, unitPrice, totalPrice } = pricedProductQuantity;

        if (quantity < this.requiredQuantity) {
            return null;
        }

        const numberOfGroups = Math.floor(quantity / this.requiredQuantity);
        const remainder = quantity % this.requiredQuantity;

        // Pay fixed amount for each group of 5, plus any remainder at full price
        const discountedPrice = (numberOfGroups * this.amount) + (remainder * unitPrice);
        const discountAmount = totalPrice - discountedPrice;

        return new Discount(product, "5 for " + this.amount, discountAmount);
    }
}
