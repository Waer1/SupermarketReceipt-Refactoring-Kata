import { ReceiptPrinter } from "../ReceiptPrinter";
import {Product} from "./Product"
import { ProductUnit } from "./ProductUnit";

export class ReceiptItem {
    private readonly EOL = process.platform === "win32" ? "\r\n" : "\n";


    public constructor(public readonly product: Product,
                       public readonly quantity: number,
                       public readonly price: number,
                       public totalPrice: number) {
    }


    getFormatedTotalPrice(): string {
        return this.format2Decimals(this.totalPrice);
    }

    getFormatedUnitPrice(): string {
        return this.format2Decimals(this.price);
    }

    getWhitespaceSize(columns: number): number {
        return columns - this.product.name.length - this.getFormatedTotalPrice().length;
    }

    getPrintableLine(columns: number): string {
        let whitespaceSize = this.getWhitespaceSize(columns);
        let line = this.product.name + ReceiptPrinter.getWhitespace(whitespaceSize) + this.getFormatedTotalPrice() + this.EOL;
        if (this.quantity != 1) {
            line += "  " + this.getFormatedUnitPrice() + " * " + this.getFormatedQuantity() + this.EOL;
        }
        return line;
    }

    format2Decimals(number: number) {
        return new Intl.NumberFormat('en-UK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number)
    }

    getFormatedQuantity(): string  {
            return ProductUnit.Each == this.product.unit
                // TODO make sure this is the simplest way to make something similar to the java version
                    ? new Intl.NumberFormat('en-UK', {maximumFractionDigits: 0}).format(this.quantity)
                    : new Intl.NumberFormat('en-UK', {minimumFractionDigits: 3}).format(this.quantity);
        }
}
