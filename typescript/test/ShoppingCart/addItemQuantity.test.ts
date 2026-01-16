import { assert } from "chai";
import { Product } from "../../src/model/Product";
import { ProductUnit } from "../../src/model/ProductUnit";
import { ShoppingCart } from "../../src/model/ShoppingCart";



describe('ShoppingCart', () => {
    describe('addItemQuantity', () => {
        it('should add a single item to the cart', () => {
            const cart = new ShoppingCart();
            const product = new Product("product", ProductUnit.Each);
            cart.addItemQuantity(product, 1);

            // insure that item length is 1
            const items = cart.getItems();
            assert.equal(items.length, 1);

            // insure that item is the same product
            assert.equal(items[0].product, product);
        })
        it('should add the same item twice', () => {
            const cart = new ShoppingCart();
            const product = new Product("product", ProductUnit.Each);
            cart.addItemQuantity(product, 1);
            cart.addItemQuantity(product, 1);

            // assertion
            // we should find 2 items on the get items
            const items = cart.getItems();
            assert.equal(items.length, 2);

            // when we fetch product quantity we should find the product exist once and quantity is 2
            const productQuantities = cart.productQuantities();

            // validate number of keys on the productQuantities
            assert.equal(Object.keys(productQuantities).length, 1);

            // validate quantity of the product
            assert.equal(productQuantities[product.name].quantity, 2);
        })
        it('should add different products', () => {
            const cart = new ShoppingCart();
            const apple = new Product("apple", ProductUnit.Each);
            const orange = new Product("orange", ProductUnit.Each);
            cart.addItemQuantity(apple, 1);
            cart.addItemQuantity(orange, 1);

            // assertion
            // we should find 2 items on the get items
            const items = cart.getItems();
            assert.equal(items.length, 2);

            // when we fetch product quantity we should find the product exist once and quantity is 2
            const productQuantities = cart.productQuantities();

            // validate number of keys on the productQuantities
            assert.equal(Object.keys(productQuantities).length, 2);

            // validate quantity of the product
            assert.equal(productQuantities[apple.name].quantity, 1);
            assert.equal(productQuantities[orange.name].quantity, 1);
        })
        it('should add fractional quantity', () => {
            const cart = new ShoppingCart();
            const product = new Product("product", ProductUnit.Each);
            cart.addItemQuantity(product, 0.5);

            // assertion
            // we should find 1 items on the get items
            const items = cart.getItems();
            assert.equal(items.length, 1);

            // when we fetch product quantity we should find the product exist once and quantity is 2
            const productQuantities = cart.productQuantities();

            // validate number of keys on the productQuantities
            assert.equal(Object.keys(productQuantities).length, 1);

            // validate quantity of the product
            assert.equal(productQuantities[product.name].quantity, 0.5);
        })


        it('should Accumulate different quantities', () => {
            const cart = new ShoppingCart();
            const apple = new Product("apple", ProductUnit.Each);
            const orange = new Product("orange", ProductUnit.Each);
            cart.addItemQuantity(apple, 1);
            cart.addItemQuantity(orange, 1);
            cart.addItemQuantity(apple, 1);
            cart.addItemQuantity(orange, 1);

            // assertion
            // we should find 4 items on the get items
            const items = cart.getItems();
            assert.equal(items.length, 4);

            // when we fetch product quantity we should find the product exist once and quantity is 2
            const productQuantities = cart.productQuantities();

            // validate number of keys on the productQuantities
            assert.equal(Object.keys(productQuantities).length, 2);

            // validate quantity of the product
            assert.equal(productQuantities[apple.name].quantity, 2);
            assert.equal(productQuantities[orange.name].quantity, 2);
        })
    });
});

