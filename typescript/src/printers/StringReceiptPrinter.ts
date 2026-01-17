import { Receipt } from "../model/Receipt";
import { ReceiptDiscount } from "../model/ReceiptDiscount";
import { IReceiptPrinter } from "./ReceiptPrinterInterface";

export class StringReceiptPrinter implements IReceiptPrinter {
    private readonly EOL = process.platform === "win32" ? "\r\n" : "\n";

    constructor(
        private readonly receipt: Receipt,
        private readonly columns: number = 40
    ) { }

    print(): string {
        let result = "";
        result += this.printItems();
        result += this.printDiscounts();
        result += this.EOL;
        result += this.printTotal();
        return result;
    }

    private printItems(): string {
        let result = "";
        for (const item of this.receipt.getItems()) {
            result += item.getPrintableLine(this.columns);
        }
        return result;
    }

    private printDiscounts(): string {
        let result = "";
        for (const discount of this.receipt.getDiscounts()) {
            const receiptDiscount = new ReceiptDiscount(discount);
            result += receiptDiscount.getPrintableLine(this.columns);
        }
        return result;
    }

    private printTotal(): string {
        const pricePresentation = StringReceiptPrinter.format2Decimals(this.receipt.getTotalPrice());
        const total = "Total: ";
        const whitespace = StringReceiptPrinter.getWhitespace(this.columns - total.length - pricePresentation.length);
        return total + whitespace + pricePresentation;
    }

    static format2Decimals(number: number): string {
        return new Intl.NumberFormat('en-UK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    }

    static getWhitespace(whitespaceSize: number): string {
        return " ".repeat(whitespaceSize);
    }
}
