import { ReceiptPrinter } from "../ReceiptPrinter";
import { Discount } from "./Discount";

export class ReceiptDiscount {
    private readonly EOL = process.platform === "win32" ? "\r\n" : "\n";

    constructor(private readonly discount: Discount) {}

    get productName() {
        return this.discount.product.name;
    }

    get discountAmount() {
        return this.discount.discountAmount;
    }

    get description() {
        return this.discount.description;
    }

    
    getPrintableLine(columns: number): string {
        let line = "";
        let productPresentation = this.productName;
        let pricePresentation = ReceiptPrinter.format2Decimals(this.discountAmount);
        let description = this.description;
        line += description;
        line += "(";
        line += productPresentation;
        line += ")";
        line += ReceiptPrinter.getWhitespace(columns - 3 - productPresentation.length - description.length - pricePresentation.length);
        line += "-";
        line += pricePresentation;
        line += this.EOL;
        return line;
    }

}
