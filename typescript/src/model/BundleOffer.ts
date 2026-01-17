import { Discount } from "./Discount";
import { IOffer, PricedProductQuantityMap } from "./IOffer";
import { Product } from "./Product";

export class BundleOffer implements IOffer {

    constructor(
        private readonly products: Product[],
        private readonly bundlePrice: number
    ) {}

    getAvailableDiscount(allProducts: PricedProductQuantityMap): Discount | null {
        // Check if all bundle products are in cart
        const completeBundles = this.getCompleteBundleCount(allProducts);

        if (completeBundles === 0) {
            return null;
        }

        // Calculate original total price for complete bundles
        const originalBundlePrice = this.calculateOriginalBundlePrice(allProducts);
        const discountAmount = (originalBundlePrice - this.bundlePrice) * completeBundles;

        return new Discount(this.products[0], 'Bundle Discount', discountAmount);
    }

    private getCompleteBundleCount(allProducts: PricedProductQuantityMap): number {
        let minQuantity = Infinity;

        for (const product of this.products) {
            const pricedProduct = allProducts.get(product.name);
            if (!pricedProduct) {
                return 0;
            }
            minQuantity = Math.min(minQuantity, Math.floor(pricedProduct.quantity));
        }

        return minQuantity === Infinity ? 0 : minQuantity;
    }

    private calculateOriginalBundlePrice(allProducts: PricedProductQuantityMap): number {
        let total = 0;

        for (const product of this.products) {
            const pricedProduct = allProducts.get(product.name);
            if (pricedProduct) {
                total += pricedProduct.unitPrice;
            }
        }

        return total;
    }
}
