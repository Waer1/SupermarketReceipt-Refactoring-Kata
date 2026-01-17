import { assert } from "chai";
import { Product } from "../../src/model/Product";
import { ProductUnit } from "../../src/model/ProductUnit";
import { Teller } from "../../src/model/Teller";
import { SpecialOfferType } from "../../src/model/SpecialOfferType";
import { ShoppingCart } from "../../src/model/ShoppingCart";
import { FakeCatalog } from "../FakeCatalog";

describe('Teller', () => {
    describe('checksOutArticlesFrom', () => {
        const apple = new Product("apple", ProductUnit.Each);
        const banana = new Product("banana", ProductUnit.Each);
        const rice = new Product("rice", ProductUnit.Kilo);

        describe('Receipt Items', () => {
            it('should return a receipt with correct items for single product', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 10);

                const teller = new Teller(catalog);
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 1);

                const receipt = teller.checksOutArticlesFrom(cart);

                assert.equal(receipt.getItems().length, 1);
                assert.equal(receipt.getItems()[0].product, apple);
                assert.equal(receipt.getItems()[0].quantity, 1);
                assert.equal(receipt.getItems()[0].price, 10);
            });

            it('should return a receipt with correct items for multiple products', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 10);
                catalog.addProduct(banana, 20);

                const teller = new Teller(catalog);
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 1);
                cart.addItemQuantity(banana, 2);

                const receipt = teller.checksOutArticlesFrom(cart);

                assert.equal(receipt.getItems().length, 2);
                assert.equal(receipt.getItems()[0].product, apple);
                assert.equal(receipt.getItems()[1].product, banana);
                assert.equal(receipt.getItems()[1].quantity, 2);
            });

            it('should handle fractional quantities (products sold by kilo)', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(rice, 5);

                const teller = new Teller(catalog);
                const cart = new ShoppingCart();
                cart.addItemQuantity(rice, 2.5);

                const receipt = teller.checksOutArticlesFrom(cart);

                assert.equal(receipt.getItems().length, 1);
                assert.equal(receipt.getItems()[0].product, rice);
                assert.equal(receipt.getItems()[0].quantity, 2.5);
                assert.equal(receipt.getItems()[0].totalPrice, 12.5); // 2.5 * 5
            });
        });

        describe('Total Price Calculation', () => {
            it('should calculate correct total price for single item', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 10);

                const teller = new Teller(catalog);
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 1);

                const receipt = teller.checksOutArticlesFrom(cart);

                assert.equal(receipt.getTotalPrice(), 10);
            });

            it('should calculate correct total price for multiple items', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 10);
                catalog.addProduct(banana, 20);

                const teller = new Teller(catalog);
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 2);
                cart.addItemQuantity(banana, 3);

                const receipt = teller.checksOutArticlesFrom(cart);

                // (2 * 10) + (3 * 20) = 20 + 60 = 80
                assert.equal(receipt.getTotalPrice(), 80);
            });

            it('should calculate correct total with fractional quantities', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(rice, 5);

                const teller = new Teller(catalog);
                const cart = new ShoppingCart();
                cart.addItemQuantity(rice, 2.5);

                const receipt = teller.checksOutArticlesFrom(cart);

                // 2.5 * 5 = 12.5
                assert.equal(receipt.getTotalPrice(), 12.5);
            });
        });

        describe('Discount Application', () => {
            it('should apply discount when offer exists for product', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 10);

                const teller = new Teller(catalog);
                teller.addSpecialOffer(SpecialOfferType.TenPercentDiscount, apple, 10);

                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 1);

                const receipt = teller.checksOutArticlesFrom(cart);

                assert.equal(receipt.getDiscounts().length, 1);
                assert.equal(receipt.getDiscounts()[0].discountAmount, 1);
            });

            it('should not apply discount when no offer exists', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 10);

                const teller = new Teller(catalog);
                // No offer added

                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 1);

                const receipt = teller.checksOutArticlesFrom(cart);

                assert.equal(receipt.getDiscounts().length, 0);
                assert.equal(receipt.getTotalPrice(), 10);
            });

            it('should apply multiple different offers to different products', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 10);
                catalog.addProduct(banana, 20);

                const teller = new Teller(catalog);
                teller.addSpecialOffer(SpecialOfferType.TenPercentDiscount, apple, 10);
                teller.addSpecialOffer(SpecialOfferType.ThreeForTwo, banana, 0);

                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 1);
                cart.addItemQuantity(banana, 3);

                const receipt = teller.checksOutArticlesFrom(cart);

                assert.equal(receipt.getDiscounts().length, 2);
            });

            it('should calculate correct total after discounts', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 10);

                const teller = new Teller(catalog);
                teller.addSpecialOffer(SpecialOfferType.TenPercentDiscount, apple, 20); // 20% off

                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 5);

                const receipt = teller.checksOutArticlesFrom(cart);

                // Total: 5 * 10 = 50
                // Discount: 20% of 50 = 10
                // Final: 50 - 10 = 40
                assert.equal(receipt.getTotalPrice(), 40);
            });
        });

        describe('Edge Cases', () => {
            it('should handle empty cart', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 10);

                const teller = new Teller(catalog);
                const cart = new ShoppingCart();

                const receipt = teller.checksOutArticlesFrom(cart);

                assert.equal(receipt.getItems().length, 0);
                assert.equal(receipt.getDiscounts().length, 0);
                assert.equal(receipt.getTotalPrice(), 0);
            });

            it('should handle same product added multiple times', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 10);

                const teller = new Teller(catalog);
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 1);
                cart.addItemQuantity(apple, 2);

                const receipt = teller.checksOutArticlesFrom(cart);

                // Items are added separately (2 line items)
                assert.equal(receipt.getItems().length, 2);
                // Total is sum of all
                assert.equal(receipt.getTotalPrice(), 30); // (1 * 10) + (2 * 10)
            });
        });

    });
});
