import { Discount } from "./Discount";
import { IOffer, PricedProductQuantityMap } from "./IOffer";
import { Product } from "./Product";

export class BundleOffer implements IOffer {

    constructor(
        private readonly products: Product[],
        private readonly discountPercent: number
    ) {}

    getAvailableDiscount(allProducts: PricedProductQuantityMap): Discount | null {
        return null;
    }
}
