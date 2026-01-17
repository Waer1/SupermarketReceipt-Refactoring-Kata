import { Discount } from "./Discount";

export class ReceiptDiscount {
    private readonly EOL = process.platform === "win32" ? "\r\n" : "\n";

    constructor(private readonly discount: Discount) {}

    
}
