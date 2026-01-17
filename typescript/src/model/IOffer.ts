import { Discount } from "./Discount";
import { PricedProductQuantity } from "./PricedProductQuantity";

export type PricedProductQuantityMap = { [productName: string]: PricedProductQuantity };

export interface IOffer {
    getAvailableDiscount(pricedProductQuantity: PricedProductQuantity, allProducts?: PricedProductQuantityMap): Discount | null;
}
