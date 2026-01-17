import { Discount } from "./Discount";
import { PricedProductQuantity } from "./PricedProductQuantity";

export interface IOffer {
    getAvailableDiscount(pricedProductQuantity: PricedProductQuantity): Discount | null;
}
