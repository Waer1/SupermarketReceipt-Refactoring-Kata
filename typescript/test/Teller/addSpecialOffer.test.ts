import { assert } from "chai";
import { Product } from "../../src/model/Product";
import { ProductUnit } from "../../src/model/ProductUnit";
import { Teller } from "../../src/model/Teller";
import { SpecialOfferType } from "../../src/model/SpecialOfferType";
import { ShoppingCart } from "../../src/model/ShoppingCart";
import { FakeCatalog } from "../FakeCatalog";

describe('Teller', () => {
    describe('addSpecialOffer', () => {
        const apple = new Product("apple", ProductUnit.Each);
        const banana = new Product("banana", ProductUnit.Each);

        it('should store an offer and apply it at checkout', () => {
            const catalog = new FakeCatalog();
            catalog.addProduct(apple, 10);

            const teller = new Teller(catalog);
            teller.addSpecialOffer(SpecialOfferType.TenPercentDiscount, apple, 10);

            const cart = new ShoppingCart();
            cart.addItemQuantity(apple, 1);

            const receipt = teller.checksOutArticlesFrom(cart);

            // 10% off 10 = 1 discount
            assert.equal(receipt.getDiscounts().length, 1);
            assert.equal(receipt.getDiscounts()[0].discountAmount, 1);
            assert.equal(receipt.getTotalPrice(), 9);
        });

        it('should replace an existing offer when adding a new one for the same product', () => {
            const catalog = new FakeCatalog();
            catalog.addProduct(apple, 10);

            const teller = new Teller(catalog);
            teller.addSpecialOffer(SpecialOfferType.TenPercentDiscount, apple, 10); // 10% off
            teller.addSpecialOffer(SpecialOfferType.TenPercentDiscount, apple, 20); // replaced with 20% off

            const cart = new ShoppingCart();
            cart.addItemQuantity(apple, 1);

            const receipt = teller.checksOutArticlesFrom(cart);

            // 20% off 10 = 2 discount (not 10% which would be 1)
            assert.equal(receipt.getDiscounts().length, 1);
            assert.equal(receipt.getDiscounts()[0].discountAmount, 2);
            assert.equal(receipt.getTotalPrice(), 8);
        });

        it('should store multiple offers for different products', () => {
            const catalog = new FakeCatalog();
            catalog.addProduct(apple, 10);
            catalog.addProduct(banana, 20);

            const teller = new Teller(catalog);
            teller.addSpecialOffer(SpecialOfferType.TenPercentDiscount, apple, 10);  // 10% off apples
            teller.addSpecialOffer(SpecialOfferType.TenPercentDiscount, banana, 50); // 50% off bananas

            const cart = new ShoppingCart();
            cart.addItemQuantity(apple, 1);
            cart.addItemQuantity(banana, 1);

            const receipt = teller.checksOutArticlesFrom(cart);

            // apple: 10% of 10 = 1 discount
            // banana: 50% of 20 = 10 discount
            assert.equal(receipt.getDiscounts().length, 2);
            assert.equal(receipt.getTotalPrice(), 19); // (10 - 1) + (20 - 10) = 19
        });

    });
});
