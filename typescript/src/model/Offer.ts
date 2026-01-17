import { Discount } from "./Discount";
import { DiscountStrategy } from "./discountStrategies/DiscountStrategy";
import { FiveForAmountOffer } from "./discountStrategies/FiveForAmountOffer";
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

    getDiscountStrategy(): DiscountStrategy | null {
        if (this.offerType == SpecialOfferType.ThreeForTwo) {
            return new ThreeForTwoOffer();
        } else if (this.offerType == SpecialOfferType.TenPercentDiscount) {
            return new TenPercentDiscountOffer(this.argument);
        } else if (this.offerType == SpecialOfferType.TwoForAmount) {
            return new TwoForAmountOffer(this.argument);
        } else if (this.offerType == SpecialOfferType.FiveForAmount) {
            return new FiveForAmountOffer(this.argument);
        } else {
            return null;
        }
    }

    getAvailableDiscount(pricedProductQuantity: PricedProductQuantity) {
        const discountStrategy = this.getDiscountStrategy();

        if (discountStrategy) {
            return discountStrategy.getDiscount(pricedProductQuantity);
        }

        return null
    }
}
