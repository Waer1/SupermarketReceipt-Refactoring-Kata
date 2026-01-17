import { assert } from "chai";
import { Product } from "../../src/model/Product";
import { ProductUnit } from "../../src/model/ProductUnit";
import { Receipt } from "../../src/model/Receipt";
import { ReceiptPrinter } from "../../src/ReceiptPrinter";
import { ProductQuantity } from "../../src/model/ProductQuantity";
import { PricedProductQuantity } from "../../src/model/PricedProductQuantity";
import { Discount } from "../../src/model/Discount";

describe('ReceiptPrinter', () => {
    describe('printReceipt', () => {
        const apple = new Product("apple", ProductUnit.Each);
        const banana = new Product("banana", ProductUnit.Each);
        const rice = new Product("rice", ProductUnit.Kilo);

        it('should print single item with quantity 1 without quantity line', () => {
            const receipt = new Receipt();
            const pq = new ProductQuantity(apple, 1);
            receipt.addProduct(new PricedProductQuantity(pq, 10));

            const printer = new ReceiptPrinter();
            const result = printer.printReceipt(receipt);
            const expectedResult = `apple                              10.00

Total:                             10.00`;
            assert.equal(result, expectedResult);
        });

        it('should print receipt with all paths: qty=1, qty>1, fractional, discounts', () => {
            const receipt = new Receipt();
            receipt.addProduct(new PricedProductQuantity(new ProductQuantity(apple, 1), 10));
            receipt.addProduct(new PricedProductQuantity(new ProductQuantity(banana, 3), 5));
            receipt.addProduct(new PricedProductQuantity(new ProductQuantity(rice, 2.5), 4));

            // Discounts
            receipt.addDiscount(new Discount(apple, "10% off", 1));
            receipt.addDiscount(new Discount(banana, "3 for 2", 5));

            const printer = new ReceiptPrinter();
            const result = printer.printReceipt(receipt);
            const expectedResult = `apple                              10.00
banana                             15.00
  5.00 * 3
rice                               10.00
  4.00 * 2.500
10% off(apple)                     -1.00
3 for 2(banana)                    -5.00

Total:                             29.00`;
            assert.equal(result, expectedResult);
        });

    });
});
