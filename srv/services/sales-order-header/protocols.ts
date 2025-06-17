import { SaledOrderHeader } from "@models/sales";

export type CreationSalesOrderResult = {
    hasError: boolean;
    totalAmount?: number;
    error?: Error;
}

export interface SalesOrderHeaderService {
    beforeCreate(params: SaledOrderHeader): Promise<CreationSalesOrderResult>;
}