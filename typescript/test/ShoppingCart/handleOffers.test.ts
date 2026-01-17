import { assert } from "chai";
import { Product } from "../../src/model/Product";
import { ProductUnit } from "../../src/model/ProductUnit";
import { ShoppingCart } from "../../src/model/ShoppingCart";
import { FakeCatalog } from "../FakeCatalog";
import { Receipt } from "../../src/model/Receipt";
import { Offer } from "../../src/model/Offer";
import { SpecialOfferType } from "../../src/model/SpecialOfferType";

describe('ShoppingCart', () => {
    describe('handleOffers', () => {
        const apple = new Product("apple", ProductUnit.Each);
        const orange = new Product("orange", ProductUnit.Each);
        const banana = new Product("banana", ProductUnit.Each);
        const wheat = new Product("wheat", ProductUnit.Kilo);

        describe('TenPercentDiscount', () => {
            const tenPercentDiscount = new Offer(SpecialOfferType.TenPercentDiscount, apple, 10);

            it('should apply 10% discount to a product', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 20);
                const receipt = new Receipt();
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 1);
                cart.handleOffers(receipt, { [apple.name]: tenPercentDiscount }, catalog);
                assert.equal(receipt.getDiscounts().length, 1);
                assert.equal(receipt.getDiscounts()[0].discountAmount, 2);
            });
            it('should calculate correct discount for fractional quantities', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 20);
                const receipt = new Receipt();
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 2.5);
                cart.handleOffers(receipt, { [apple.name]: tenPercentDiscount }, catalog);
                // 2.5 * 20 = 50
                // 50 * 10% = 5
                assert.equal(receipt.getDiscounts().length, 1);
                assert.equal(receipt.getDiscounts()[0].discountAmount, 5);
            });

            it('should handle multiple discounts', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 20);
                catalog.addProduct(wheat, 10);
                const receipt = new Receipt();
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 1);
                cart.addItemQuantity(wheat, 5);
                const tenPercentDiscountApple = new Offer(SpecialOfferType.TenPercentDiscount, apple, 10);
                const tenPercentDiscountWheat = new Offer(SpecialOfferType.TenPercentDiscount, wheat, 10);
                cart.handleOffers(receipt, { [apple.name]: tenPercentDiscountApple, [wheat.name]: tenPercentDiscountWheat }, catalog);
                assert.equal(receipt.getDiscounts().length, 2);
                assert.equal(receipt.getDiscounts()[0].discountAmount, 2);
                assert.equal(receipt.getDiscounts()[1].discountAmount, 5);
            })

            it('should not apply discount if the product have no offers', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 20);
                const receipt = new Receipt();
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 1);
                cart.handleOffers(receipt, {
                    [orange.name]: tenPercentDiscount
                }, catalog);
                assert.equal(receipt.getDiscounts().length, 0);
            })

        });

        describe('ThreeForTwo', () => {

            const threeForTwoDiscount = new Offer(SpecialOfferType.ThreeForTwo, apple, 2);

            it('should not apply discount when quantity is less than 3', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 20);
                const receipt = new Receipt();
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 2);
                cart.handleOffers(receipt, {
                    [apple.name]: threeForTwoDiscount
                }, catalog);
                const discounts = receipt.getDiscounts();
                assert.equal(discounts.length, 0);
            });

            it('should apply discount and the amount to be unit price * 1 when quantity is exactly 3', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 20);
                const receipt = new Receipt();
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 3);
                cart.handleOffers(receipt, {
                    [apple.name]: threeForTwoDiscount
                }, catalog);
                const discounts = receipt.getDiscounts();
                assert.equal(discounts.length, 1);
                assert.equal(discounts[0].discountAmount, 20);
            });


            it('should apply discount correctly when quantity is more than 3 (e.g., 4 items)', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 20);
                const receipt = new Receipt();
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 4);
                cart.handleOffers(receipt, {
                    [apple.name]: threeForTwoDiscount
                }, catalog);
                const discounts = receipt.getDiscounts();
                // since i buy 4 the discount amout will be applies on only 3 of them which mean i will get 20 as discount amount
                assert.equal(discounts.length, 1);
                assert.equal(discounts[0].discountAmount, 20);
            });


            it('should apply multiple discounts when quantity is 6 or more', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 20);
                const receipt = new Receipt();
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 6);
                cart.handleOffers(receipt, {
                    [apple.name]: threeForTwoDiscount
                }, catalog);
                const discounts = receipt.getDiscounts();
                assert.equal(discounts.length, 1);
                assert.equal(discounts[0].discountAmount, 40);
            });


            it('should not apply any dicounts if there is no offers on this products', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 20);
                const receipt = new Receipt();
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 1);
                cart.handleOffers(receipt, {
                    [orange.name]: threeForTwoDiscount
                }, catalog);
                const discounts = receipt.getDiscounts();
                assert.equal(discounts.length, 0);
            });
        });

        describe('TwoForAmount', () => {
            
            const twoForAmountDiscount = new Offer(SpecialOfferType.TwoForAmount, apple, 30);

            it('should not apply discount when quantity is less than 2', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 20);
                const receipt = new Receipt();
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 1);
                cart.handleOffers(receipt, {
                    [apple.name]: twoForAmountDiscount
                }, catalog);
                const discounts = receipt.getDiscounts();
                assert.equal(discounts.length, 0);
            });
            it('should apply discount when quantity is exactly 2', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 20);
                const receipt = new Receipt();
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 2);
                cart.handleOffers(receipt, {
                    [apple.name]: twoForAmountDiscount
                }, catalog);
                const discounts = receipt.getDiscounts();
                assert.equal(discounts.length, 1);
                // discount amount will be original price which is 20 * 2 - dicounted amount which is 30
                assert.equal(discounts[0].discountAmount, 10);
            });
            it('should apply discount correctly when quantity is more than 2 (e.g., 3 items)', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 20);
                const receipt = new Receipt();
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 3);
                cart.handleOffers(receipt, {
                    [apple.name]: twoForAmountDiscount
                }, catalog);
                const discounts = receipt.getDiscounts();
                assert.equal(discounts.length, 1);
                // discount amount will be original price which is 20 * 2 - dicounted amount which is 30
                assert.equal(discounts[0].discountAmount, 10);
            });

            it('should apply dicount multiple times if the quantity is 2 * X like 4,6,8,10 etc', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 20);
                const receipt = new Receipt();
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 4);
                cart.handleOffers(receipt, {
                    [apple.name]: twoForAmountDiscount
                }, catalog);
                const discounts = receipt.getDiscounts();
                assert.equal(discounts.length, 1);
                // discount amount will be original price which is 20 * 2 - dicounted amount which is 30
                assert.equal(discounts[0].discountAmount, 20);
            });
        });

        describe('FiveForAmount', () => {
            const fiveForAmountDiscount = new Offer(SpecialOfferType.FiveForAmount, apple, 80);
            it('should not apply discount when quantity is less than 5', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 20);
                const receipt = new Receipt();
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 4);
                cart.handleOffers(receipt, {
                    [apple.name]: fiveForAmountDiscount
                }, catalog);
                const discounts = receipt.getDiscounts();
                assert.equal(discounts.length, 0);
            });
            it('should apply discount when quantity is exactly 5', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 20);
                const receipt = new Receipt();
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 5);
                cart.handleOffers(receipt, {
                    [apple.name]: fiveForAmountDiscount
                }, catalog);
                // actual price is 20 * 5 = 100
                // discount amount will be original price which is 20 * 5 - dicounted amount which is 80
                const discounts = receipt.getDiscounts();
                assert.equal(discounts.length, 1);
                assert.equal(discounts[0].discountAmount, 20);
            });
            it('should apply discount correctly when quantity is more than 5 (e.g., 7 items)', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 20);
                const receipt = new Receipt();
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 7);
                cart.handleOffers(receipt, {
                    [apple.name]: fiveForAmountDiscount
                }, catalog);
                const discounts = receipt.getDiscounts();
                assert.equal(discounts.length, 1);
                assert.equal(discounts[0].discountAmount, 20);
            });

            it('should apply discount multiple times when quantity is 5 * X like 10,15,20 etc', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 20);
                const receipt = new Receipt();
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 10);
                cart.handleOffers(receipt, {
                    [apple.name]: fiveForAmountDiscount
                }, catalog);
                const discounts = receipt.getDiscounts();
                assert.equal(discounts.length, 1);
                assert.equal(discounts[0].discountAmount, 40);
            });

        });

        describe('No Offer', () => {
            it('should not apply any discount when product has no offer', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 20);
                const receipt = new Receipt();
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 1);
                cart.handleOffers(receipt, {}, catalog);
                const discounts = receipt.getDiscounts();
                assert.equal(discounts.length, 0);
            });
        });

        describe('Multiple Products', () => {
            const tenPercentDiscount = new Offer(SpecialOfferType.TenPercentDiscount, apple, 10);
            const threeForTwoDiscount = new Offer(SpecialOfferType.ThreeForTwo, banana, 20);
            it('should apply different offers to different products', () => {
                const catalog = new FakeCatalog();
                catalog.addProduct(apple, 20);
                catalog.addProduct(banana, 10);
                const receipt = new Receipt();
                const cart = new ShoppingCart();
                cart.addItemQuantity(apple, 1);
                cart.addItemQuantity(banana, 3);
                cart.handleOffers(receipt, {
                    [apple.name]: tenPercentDiscount,
                    [banana.name]: threeForTwoDiscount
                }, catalog);
                const discounts = receipt.getDiscounts();
                assert.equal(discounts.length, 2);
                assert.equal(discounts[0].discountAmount, 2);
                assert.equal(discounts[1].discountAmount, 10);
            });
        });

        describe('BundleDiscount', () => {
            // Bundle: buy all products in bundle, get 10% off the bundle total
            // Note: BundleDiscount needs a different Offer structure - array of products

            it('should apply 10% discount when all bundle items are purchased');

            it('should apply discount only once per complete bundle');

            it('should apply discount multiple times for multiple complete bundles');

            it('should not apply discount when bundle is incomplete');

            it('should work with 3-product bundle');
        });

    });
});
