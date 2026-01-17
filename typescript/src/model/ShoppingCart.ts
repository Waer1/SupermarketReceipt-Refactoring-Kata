import {Product} from "./Product"
import {SupermarketCatalog} from "./SupermarketCatalog"
import * as _ from "lodash"
import {ProductQuantity} from "./ProductQuantity"
import {Receipt} from "./Receipt"
import {IOffer, PricedProductQuantityMap} from "./IOffer"
import { PricedProductQuantity } from "./PricedProductQuantity"

type ProductQuantities = { [productName: string]: ProductQuantity }
export type OffersByProduct = {[productName: string]: IOffer};

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


    handleOffers(receipt: Receipt,  offers: OffersByProduct, catalog: SupermarketCatalog ):void {
        // Build map of all priced products (needed for bundle offers)
        const allPricedProducts: PricedProductQuantityMap = {};
        for (const productName in this.productQuantities()) {
            const productQuantity = this._productQuantities[productName];
            allPricedProducts[productName] = new PricedProductQuantity(productQuantity, catalog.getUnitPrice(productQuantity.product));
        }

        // Process offers
        for (const productName in this.productQuantities()) {
            const offer : IOffer = offers[productName];
            if (offer) {
                const discount = offer.getAvailableDiscount(allPricedProducts);
                if (discount != null) receipt.addDiscount(discount);
            }
        }
    }
}
