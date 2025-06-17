import { SaledOrderHeader, SaledOrderHeaders } from '@models/sales';
import { User } from '@sap/cds';

export type CreationSalesOrderResult = {
    hasError: boolean;
    totalAmount?: number;
    error?: Error;
}

export interface SalesOrderHeaderService {
    beforeCreate(params: SaledOrderHeader): Promise<CreationSalesOrderResult>;
    afterCreate(params: SaledOrderHeaders, loggedUser: User): Promise<void>;
}
