import { SaledOrderHeader } from "@models/sales";

export type CreationPayloadValidationResult = {
    hasError: boolean;
    totalAmount?: number;
    error?: Error;
}

export interface SalesOrderHeaderController {
    beforeCreate(params: SaledOrderHeader): Promise<CreationPayloadValidationResult>;
}