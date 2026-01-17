import { Receipt } from "../model/Receipt";
import { IReceiptPrinter } from "./ReceiptPrinterInterface";

export class HtmlReceiptPrinter implements IReceiptPrinter {
    constructor(private readonly receipt: Receipt) {}

    print(): string {
        return "";
    }
}
