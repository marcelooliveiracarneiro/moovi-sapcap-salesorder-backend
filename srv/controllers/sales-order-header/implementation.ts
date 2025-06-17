import { SaledOrderHeader, SaledOrderHeaders } from '@models/sales';
import { CreationPayloadValidationResult, SalesOrderHeaderController } from './protocols';
import { SalesOrderHeaderService } from 'srv/services/sales-order-header/protocols';
import { User } from '@sap/cds';

export class SalesOrderHeaderControllerImpl implements SalesOrderHeaderController {
    constructor(private readonly service: SalesOrderHeaderService) {}

    public async beforeCreate(params: SaledOrderHeader): Promise<CreationPayloadValidationResult> {
        return this.service.beforeCreate(params);
    }

    public async afterCreate(params: SaledOrderHeaders, loggedUser: User): Promise<void> {
        return this.service.afterCreate(params,loggedUser);
    }
    

}
