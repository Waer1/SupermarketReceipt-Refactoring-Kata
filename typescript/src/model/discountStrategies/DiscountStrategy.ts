import { Discount } from "../Discount";
import { PricedProductQuantity } from "../PricedProductQuantity";

export interface DiscountStrategy {
    getDiscount(pricedProductQuantity: PricedProductQuantity): Discount | null;
}
