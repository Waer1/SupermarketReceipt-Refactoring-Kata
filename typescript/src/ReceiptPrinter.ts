import {ProductUnit} from "./model/ProductUnit"
import {ReceiptItem} from "./model/ReceiptItem"
import {Receipt} from "./model/Receipt"
import { ReceiptDiscount } from "./model/ReceiptDiscount";

export class ReceiptPrinter {

    private readonly EOL = process.platform === "win32" ? "\r\n" : "\n";

    public constructor(private readonly columns: number = 40) {
    }

    public printReceipt(receipt: Receipt): string {
        let result = "";
        for (const item of receipt.getItems()) {
            result += item.getPrintableLine(this.columns);
        }

        for (const discount of receipt.getDiscounts()) {
            const receiptDiscount = new ReceiptDiscount(discount);
            result += receiptDiscount.getPrintableLine(this.columns);
        }
        result = this.addEndLine(result);
        const totalPriceLine = this.getTotalPriceLine(receipt);
        result += totalPriceLine;

        return result;
    }

    getTotalPriceLine(receipt: Receipt): string {
        let pricePresentation = ReceiptPrinter.format2Decimals(receipt.getTotalPrice());
        let total = "Total: ";
        let whitespace = ReceiptPrinter.getWhitespace(this.columns - total.length - pricePresentation.length);
        return total + whitespace + pricePresentation;
    }

    addEndLine(result: string): string {
        return result + this.EOL;
    }

    static format2Decimals(number: number) {
        return new Intl.NumberFormat('en-UK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number)
    }
    

    private static presentQuantity( item: ReceiptItem): string  {
        return ProductUnit.Each == item.product.unit
            // TODO make sure this is the simplest way to make something similar to the java version
                ? new Intl.NumberFormat('en-UK', {maximumFractionDigits: 0}).format(item.quantity)
                : new Intl.NumberFormat('en-UK', {minimumFractionDigits: 3}).format(item.quantity);
    }

    static getWhitespace(whitespaceSize: number): string {
        return " ".repeat(whitespaceSize);
    }
}
