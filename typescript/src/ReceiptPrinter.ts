import {Receipt} from "./model/Receipt"
import { PrinterType } from "./printers/PrinterType";
import { IReceiptPrinter } from "./printers/ReceiptPrinterInterface";
import { StringReceiptPrinter } from "./printers/StringReceiptPrinter";

export class ReceiptPrinter {
    public constructor(
        private readonly columns: number = 40, 
        private readonly printerType: PrinterType = PrinterType.String

    ) {}

    getPrinter(printerType: PrinterType, receipt: Receipt): IReceiptPrinter {
        switch (printerType) {
            case PrinterType.String:
                return new StringReceiptPrinter(receipt, this.columns);
            default:
                throw new Error("Invalid printer type");
        }
    }

    public printReceipt(receipt: Receipt): string {
        const printer = this.getPrinter(this.printerType, receipt);
        return printer.print();
    }

    static format2Decimals(number: number) {
        return new Intl.NumberFormat('en-UK', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number)
    }

    static getWhitespace(whitespaceSize: number): string {
        return " ".repeat(whitespaceSize);
    }
}
