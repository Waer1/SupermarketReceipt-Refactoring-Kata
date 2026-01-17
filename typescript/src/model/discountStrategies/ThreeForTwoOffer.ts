import { Discount } from "../Discount";
import { PricedProductQuantity } from "../PricedProductQuantity";
import { DiscountStrategy } from "./DiscountStrategy";

export class ThreeForTwoOffer implements DiscountStrategy {
    private readonly requiredQuantity = 3;

    getDiscount(pricedProductQuantity: PricedProductQuantity): Discount | null {
        const { product, quantity, unitPrice, totalPrice } = pricedProductQuantity;

        if (quantity < this.requiredQuantity) {
            return null;
        }

        const numberOfGroups = Math.floor(quantity / this.requiredQuantity);
        const remainder = quantity % this.requiredQuantity;

        // Pay for 2 out of every 3 items, plus any remainder at full price
        const discountedPrice = (numberOfGroups * 2 * unitPrice) + (remainder * unitPrice);
        const discountAmount = totalPrice - discountedPrice;

        return new Discount(product, "3 for 2", discountAmount);
    }
}
