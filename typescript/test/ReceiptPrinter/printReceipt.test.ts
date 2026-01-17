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

    });
});
