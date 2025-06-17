import cds, { Request, Service } from '@sap/cds';
import { Customers, Product, Products, SaledOrderHeader, SaledOrderHeaders, SaledOrderItem, SaledOrderItems } from '@models/sales'
import { customerController } from './factories/controllers/customer';
import { salesOrderHeaderController } from './factories/controllers/sales-order-header';
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
        const headersAsArray = Array.isArray(results) ? results : [results] as SaledOrderHeaders;
        for (const header of headersAsArray) {
            const items = header.items as SaledOrderItems;
            const productsData = items.map(item => ({
                id: item.product_id,
                quantity: item.quantity as number
            }));
            const productsIds = productsData.map((productData) => productData.id);
            const productsQuery = SELECT.from('sales.Products').where({ id: productsIds });
            const products: Products = await cds.run(productsQuery);
            for (const productData of productsData) {
               const productFound = products.find(product => product.id == productData.id) as Product;  
               productFound.stock = (productFound.stock as number) - productData.quantity;
               await cds.update('sales.Products').where({ id: productFound.id }).with({ stock: productFound.stock });
            }

            const headersAsString =JSON.stringify(header);
            const userAsString = JSON.stringify(request.user);
            const log = [{
                header_id: header.id,
                userData: userAsString,
                orderData: headersAsArray
            }];
            await cds.create('sales.SaledOrderLogs').entries(log);
    
        }
    });

}