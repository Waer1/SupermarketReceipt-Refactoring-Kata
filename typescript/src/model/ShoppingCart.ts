import {Product} from "./Product"
import {SupermarketCatalog} from "./SupermarketCatalog"
import * as _ from "lodash"
import {ProductQuantity} from "./ProductQuantity"
import {Discount} from "./Discount"
import {Receipt} from "./Receipt"
import {Offer} from "./Offer"
import {SpecialOfferType} from "./SpecialOfferType"

type ProductQuantities = { [productName: string]: ProductQuantity }
export type OffersByProduct = {[productName: string]: Offer};

export class ShoppingCart {

    private readonly  items: ProductQuantity[] = [];
    _productQuantities: ProductQuantities = {};


    getItems(): ProductQuantity[] {
        return _.clone(this.items);
    }

    addItem(product: Product): void {
        this.addItemQuantity(product, 1.0);
    }

    productQuantities(): ProductQuantities {
        return this._productQuantities;
    }


    public addItemQuantity(product: Product, quantity: number): void {
        let productQuantity = new ProductQuantity(product, quantity)
        this.items.push(productQuantity);
        let currentQuantity = this._productQuantities[product.name]
        if (currentQuantity) {
            this._productQuantities[product.name] = this.increaseQuantity(product, currentQuantity, quantity);
        } else {
            this._productQuantities[product.name] = productQuantity;
        }

    }

    private increaseQuantity(product: Product, productQuantity: ProductQuantity, quantity: number) {
        return new ProductQuantity(product, productQuantity.quantity + quantity)
    }


    private getRequiredQuantityForDiscount(offer: Offer): number {
        if (offer.offerType == SpecialOfferType.ThreeForTwo) {
            return 3;
        } else if (offer.offerType == SpecialOfferType.TwoForAmount) {
            return 2;
        } if (offer.offerType == SpecialOfferType.FiveForAmount) {
            return 5;
        } else if (offer.offerType == SpecialOfferType.TenPercentDiscount) {
            return 1;
        }
        return 0;
    }


    private getAvailableDiscount(offer: Offer, quantity: number, product: Product, x: number, catalog: SupermarketCatalog) {
        const unitPrice: number= catalog.getUnitPrice(product);
        const numberOfXs = Math.floor(quantity / x);

        if (offer.offerType == SpecialOfferType.ThreeForTwo && quantity > 2) {
            // this is for each 3 items discountAmount is the price of the 1 of them 
            const discountAmount = quantity * unitPrice - ((numberOfXs * 2 * unitPrice) + quantity % 3 * unitPrice)
            return new Discount(product, "3 for 2", discountAmount)
        }
        if (offer.offerType == SpecialOfferType.TenPercentDiscount) {
            return new Discount(product, offer.argument + "% off", quantity * unitPrice * offer.argument / 100.0)
        }
        if (offer.offerType == SpecialOfferType.FiveForAmount && quantity >= 5) {
            const discountTotal = unitPrice * quantity - (offer.argument * numberOfXs + quantity % 5 * unitPrice)
            return new Discount(product, x + " for " + offer.argument, discountTotal)
        }
        if (offer.offerType == SpecialOfferType.TwoForAmount && quantity >= 2) {
            const total = offer.argument * Math.floor(quantity / x) + quantity % 2 * unitPrice
            const discountN = unitPrice * quantity - total
            return new Discount(product, "2 for " + offer.argument, discountN)
        }
        return null
    }

    handleOffers(receipt: Receipt,  offers: OffersByProduct, catalog: SupermarketCatalog ):void {
        for (const productName in this.productQuantities()) {
            const productQuantity = this._productQuantities[productName]
            const product = productQuantity.product;
            const quantity: number = this._productQuantities[productName].quantity;
            if (offers[productName]) {
                const offer : Offer = offers[productName];
                
                let x = this.getRequiredQuantityForDiscount(offer);

                // above part is responsible for getting X which is the required number of item you need to get to have a discount

                const discount = this.getAvailableDiscount(offer, quantity, product, x, catalog)
                // above part is responsible for getting the discount amount 

                if (discount != null)
                    receipt.addDiscount(discount);
            }

        }
    }
}
