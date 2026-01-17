import { Discount } from "./Discount";
import { PricedProductQuantity } from "./PricedProductQuantity";

export type PricedProductQuantityMap = { [productName: string]: PricedProductQuantity };

export interface IOffer {
    getAvailableDiscount(allProducts: PricedProductQuantityMap): Discount | null;
}
