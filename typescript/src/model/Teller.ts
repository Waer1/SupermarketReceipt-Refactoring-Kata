import {SupermarketCatalog} from "./SupermarketCatalog"
import {OffersByProduct, ShoppingCart} from "./ShoppingCart"
import {Product} from "./Product"
import {Receipt} from "./Receipt"
import {Offer} from "./Offer"
import {SpecialOfferType} from "./SpecialOfferType"
import { PricedProductQuantity } from "./PricedProductQuantity"

export class Teller {

    private offers: OffersByProduct = {};

    public constructor(private readonly catalog: SupermarketCatalog ) {
    }

    public addSpecialOffer(offerType: SpecialOfferType , product: Product, argument: number): void {
        this.offers[product.name] = new Offer(offerType, product, argument);
    }

    public checksOutArticlesFrom(theCart: ShoppingCart): Receipt {
        const receipt = new Receipt();
        const productQuantities = theCart.getItems();
        for (let pq of productQuantities) {
            let unitPrice = this.catalog.getUnitPrice(pq.product);
            let pricedProductQuantity = new PricedProductQuantity(pq, unitPrice);
            receipt.addProduct(pricedProductQuantity);
        }
        theCart.handleOffers(receipt, this.offers, this.catalog);

        return receipt;
    }

}
