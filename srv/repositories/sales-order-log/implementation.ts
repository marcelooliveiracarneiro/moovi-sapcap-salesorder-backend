import cds from '@sap/cds';

import { SalesOrderLogProps, SalesOrderLogModel } from "srv/models/sales-order-log";
import { SalesOrderLogRepository } from "./protocols";

export class SalesOrderLogRepositoryImpl implements SalesOrderLogRepository {
    public async create(logs: SalesOrderLogModel[]): Promise<void> {
        const logObjects = logs.map( log => log.toObject() );
        await cds.create('sales.SaledOrderLogs').entries(logObjects);
    }

}