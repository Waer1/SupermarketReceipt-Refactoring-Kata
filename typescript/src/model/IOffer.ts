import { Discount } from "./Discount";
import { PricedProductQuantity } from "./PricedProductQuantity";

export class PricedProductQuantityMap {
    private map: { [productName: string]: PricedProductQuantity } = {};
    constructor(
        private readonly pricedProductQuantity: PricedProductQuantity[]
    ) {
        this.map = Object.fromEntries(
            pricedProductQuantity.map((pricedProductQuantity) => [pricedProductQuantity.product.name, pricedProductQuantity])
        );
    }

    get(productName: string): PricedProductQuantity | undefined {
        return this.map[productName];
    }

    has(productName: string): boolean {
        return productName in this.map;
    }

    keys(): string[] {
        return Object.keys(this.map);
    }
}

export interface IOffer {
    getAvailableDiscount(allProducts: PricedProductQuantityMap): Discount | null;
}
