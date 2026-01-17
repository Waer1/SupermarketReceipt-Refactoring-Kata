import { Product } from "./Product";
import { ProductQuantity } from "./ProductQuantity";

export class PricedProductQuantity {
    constructor(
        private readonly productQuantity: ProductQuantity,
        public readonly unitPrice: number
    ) {}

    get product(): Product {
        return this.productQuantity.product;
    }

    get quantity(): number {
        return this.productQuantity.quantity;
    }

    get totalPrice(): number {
        return this.quantity * this.unitPrice;
    }
}
