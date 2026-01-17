import { Discount } from "./Discount";
import { Product } from "./Product"
import { SpecialOfferType } from "./SpecialOfferType"
import { SupermarketCatalog } from "./SupermarketCatalog";

export class Offer {

    public constructor(public readonly offerType: SpecialOfferType,
        public readonly product: Product,
        public readonly argument: number) {
    }

    getProduct(): Product {
        return this.product;
    }

    getRequiredQuantityForDiscount(): number {
        if (this.offerType == SpecialOfferType.ThreeForTwo) {
            return 3;
        } else if (this.offerType == SpecialOfferType.TwoForAmount) {
            return 2;
        } else if (this.offerType == SpecialOfferType.FiveForAmount) {
            return 5;
        } else if (this.offerType == SpecialOfferType.TenPercentDiscount) {
            return 1;
        } else {
            return 0;
        }
    }

    

    getAvailableDiscount(quantity: number, product: Product, catalog: SupermarketCatalog) {
        const unitPrice: number = catalog.getUnitPrice(product);
        const x = this.getRequiredQuantityForDiscount();
        const numberOfXs = Math.floor(quantity / x);

        if (this.offerType == SpecialOfferType.ThreeForTwo && quantity > 2) {
            // this is for each 3 items discountAmount is the price of the 1 of them 
            const discountAmount = quantity * unitPrice - ((numberOfXs * 2 * unitPrice) + quantity % 3 * unitPrice)
            return new Discount(product, "3 for 2", discountAmount)
        }
        if (this.offerType == SpecialOfferType.TenPercentDiscount) {
            return new Discount(product, this.argument + "% off", quantity * unitPrice * this.argument / 100.0)
        }
        if (this.offerType == SpecialOfferType.FiveForAmount && quantity >= 5) {
            const discountTotal = unitPrice * quantity - (this.argument * numberOfXs + quantity % 5 * unitPrice)
            return new Discount(product, x + " for " + this.argument, discountTotal)
        }
        if (this.offerType == SpecialOfferType.TwoForAmount && quantity >= 2) {
            const total = this.argument * Math.floor(quantity / x) + quantity % 2 * unitPrice
            const discountN = unitPrice * quantity - total
            return new Discount(product, "2 for " + this.argument, discountN)
        }
        return null
    }
}
