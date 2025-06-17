import { SaledOrderHeader, SaledOrderHeaders } from '@models/sales';
import { User } from '@sap/cds';

export type CreationPayloadValidationResult = {
    hasError: boolean;
    totalAmount?: number;
    error?: Error;
}

export interface SalesOrderHeaderController {
    beforeCreate(params: SaledOrderHeader): Promise<CreationPayloadValidationResult>;
    afterCreate(params: SaledOrderHeaders, loggedUser: User): Promise<void>;
}
