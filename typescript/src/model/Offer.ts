import {Product} from "./Product"
import {SpecialOfferType} from "./SpecialOfferType"

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

}
