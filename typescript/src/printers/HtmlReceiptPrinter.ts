import { Receipt } from "../model/Receipt";
import { ReceiptPrinter } from "../ReceiptPrinter";
import { IReceiptPrinter } from "./ReceiptPrinterInterface";

export class HtmlReceiptPrinter implements IReceiptPrinter {
    constructor(private readonly receipt: Receipt) {}

    print(): string {
        let html = "<ul>";

        for (const item of this.receipt.getItems()) {
            html += `<li>${item.product.name} - ${ReceiptPrinter.format2Decimals(item.totalPrice)}</li>`;
        }

        for (const discount of this.receipt.getDiscounts()) {
            html += `<li>${discount.description}(${discount.product.name}) - -${ReceiptPrinter.format2Decimals(discount.discountAmount)}</li>`;
        }

        html += "</ul>";
        html += `<p>Total: ${ReceiptPrinter.format2Decimals(this.receipt.getTotalPrice())}</p>`;

        return html;
    }
}
