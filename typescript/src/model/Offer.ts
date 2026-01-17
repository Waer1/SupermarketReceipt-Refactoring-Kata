import { Discount } from "./Discount";
import { DiscountStrategy } from "./discountStrategies/DiscountStrategy";
import { TenPercentDiscountOffer } from "./discountStrategies/TenPercentDiscountOffer";
import { ThreeForTwoOffer } from "./discountStrategies/ThreeForTwoOffer";
import { TwoForAmountOffer } from "./discountStrategies/TwoForAmountOffer";
import { PricedProductQuantity } from "./PricedProductQuantity";
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

    getDiscountStrategy(): DiscountStrategy | null {
        if (this.offerType == SpecialOfferType.ThreeForTwo) {
            return new ThreeForTwoOffer();
        } else if (this.offerType == SpecialOfferType.TenPercentDiscount) {
            return new TenPercentDiscountOffer(this.argument);
        } else if (this.offerType == SpecialOfferType.TwoForAmount) {
            return new TwoForAmountOffer(this.argument);
        } else {
            return null;
        }
    }


    getAvailableDiscount(pricedProductQuantity: PricedProductQuantity) {
        const unitPrice = pricedProductQuantity.unitPrice;
        const product = pricedProductQuantity.product;
        const quantity = pricedProductQuantity.quantity;
        const x = this.getRequiredQuantityForDiscount();
        const numberOfXs = Math.floor(quantity / x);
        const discountStrategy = this.getDiscountStrategy();

        if (discountStrategy) {
            return discountStrategy.getDiscount(pricedProductQuantity);
        }

        if (this.offerType == SpecialOfferType.FiveForAmount && quantity >= 5) {
            const discountTotal = unitPrice * quantity - (this.argument * numberOfXs + quantity % 5 * unitPrice)
            return new Discount(product, x + " for " + this.argument, discountTotal)
        }
        return null
    }
}
