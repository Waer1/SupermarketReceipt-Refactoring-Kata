import { assert } from "chai";
import { Product } from "../../src/model/Product";
import { ProductUnit } from "../../src/model/ProductUnit";
import { Receipt } from "../../src/model/Receipt";
import { ReceiptPrinter } from "../../src/ReceiptPrinter";
import { ProductQuantity } from "../../src/model/ProductQuantity";
import { PricedProductQuantity } from "../../src/model/PricedProductQuantity";
import { Discount } from "../../src/model/Discount";
import { PrinterType } from "../../src/printers/PrinterType";

describe('HtmlReceiptPrinter', () => {
    describe('print', () => {
        const apple = new Product("apple", ProductUnit.Each);
        const banana = new Product("banana", ProductUnit.Each);
        const rice = new Product("rice", ProductUnit.Kilo);

        it('should print single item', () => {
            const receipt = new Receipt();
            receipt.addProduct(new PricedProductQuantity(new ProductQuantity(apple, 1), 10));

            const printer = new ReceiptPrinter(40, PrinterType.Html);
            const result = printer.printReceipt(receipt);
            const expected = `<ul><li>apple - 10.00</li></ul><p>Total: 10.00</p>`;
            assert.equal(result, expected);
        });

        it('should print multiple items', () => {
            const receipt = new Receipt();
            receipt.addProduct(new PricedProductQuantity(new ProductQuantity(apple, 1), 10));
            receipt.addProduct(new PricedProductQuantity(new ProductQuantity(banana, 3), 5));

            const printer = new ReceiptPrinter(40, PrinterType.Html);
            const result = printer.printReceipt(receipt);
            const expected = `<ul><li>apple - 10.00</li><li>banana - 15.00</li></ul><p>Total: 25.00</p>`;
            assert.equal(result, expected);
        });

        it('should print items with discounts', () => {
            const receipt = new Receipt();
            receipt.addProduct(new PricedProductQuantity(new ProductQuantity(apple, 1), 10));
            receipt.addDiscount(new Discount(apple, "10% off", 1));

            const printer = new ReceiptPrinter(40, PrinterType.Html);
            const result = printer.printReceipt(receipt);
            const expected = `<ul><li>apple - 10.00</li><li>10% off(apple) - -1.00</li></ul><p>Total: 9.00</p>`;
            assert.equal(result, expected);
        });

    });
});
