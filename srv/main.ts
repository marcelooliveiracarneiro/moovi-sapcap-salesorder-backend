import cds, { Request, Service } from '@sap/cds';
import { Customers, Product, Products, SaledOrderHeader, SaledOrderHeaders, SaledOrderItem, SaledOrderItems, SaledOrderLog } from '@models/sales'
import { customerController } from './factories/controllers/customer';
import { salesOrderHeaderController } from './factories/controllers/sales-order-header';
import { SalesOrderLogModel } from './models/sales-order-log';
import { FullRequestParameters } from './protocols';
import { log } from 'console';

export default (service: Service) => {
    service.before('READ', '*', (request: Request) => {
        const inRole = ["admin","read_only_user"].find( role => request.user.is(role) );
        if (!inRole) {
            return request.reject(403,'Não Autorizado');
        }
    });

    //
    // Customers
    //
    service.after('READ','Customers', (customersList: Customers, request) => {
        (request as unknown as FullRequestParameters<Customers>).results = customerController.afterRead(customersList);
    });

    //
    // SalesOrder
    //
    service.before('CREATE','SaledOrderHeaders', async (request: Request) => {
        const params = request.data;
        const result = await salesOrderHeaderController.beforeCreate(request.data);
        if (result.hasError) {
            return request.reject(400,result.error?.message as string)
        }
        request.data.totalAmount = result.totalAmount;
    });

    service.after('CREATE', 'SaledOrderHeaders', async (results: SaledOrderHeaders, request: Request) => {
        await salesOrderHeaderController.afterCreate(results,request.user);
    });

}