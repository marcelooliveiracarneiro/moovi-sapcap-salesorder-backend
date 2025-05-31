import cds, { Request, Service } from '@sap/cds';
import { Customers, Product, Products, SaledOrderItem, SaledOrderItems } from '@models/sales'

export default (service: Service) => {
    service.after('READ','Customers', (results: Customers) => {
        results.forEach( customer => {
            if (!customer.email?.includes('@')) {
                customer.email = `${customer.email}@gmail`;
            }
        })
    });
    service.before('CREATE','SaledOrderHeaders', async (request: Request) => {
        const params = request.data;
        if (!params.customer_id) {
            return request.reject( 400, 'Invalid Customer');
        };
        if ((!params.items) || (params.items?.length === 0)) {
            return request.reject( 400, 'Items is Empty');
        }
        const customerQuery = SELECT.one.from('sales.Customers').where({ id: params.customer_id});
        const customer = await cds.run(customerQuery);
        if (!customer) {
            return request.reject( 404, 'Customer not found');
        };
        const productsIds = params.items.map((item: SaledOrderItem) => item.product_id);
        const productsQuery = SELECT.from('sales.Products').where({ id: productsIds });
        const products: Products = await cds.run(productsQuery);
/*         const dbProducts = products.map((product: Product) => product.id);
        if (!productsIds.every((productId: any) => dbProducts.includes(productId))) {
            return request.reject( 404, 'Produto não encontrado');
        }
        if (products.some(((product: Product) => product.stock === 0))) {
            return request.reject( 400, 'Produto sem estoue disponível');
        }
 */        
        const items: SaledOrderItems = params.items;
        for (const item of items) {
            const dbProduct = products.find(product => product.id === item.product_id);
            if (!dbProduct) {
                return request.reject( 404, `Produto ${item.product_id} não encontrado`);
            }
            if (dbProduct.stock === 0) {
                return request.reject( 400, `Produto ${dbProduct.id} - ${dbProduct.name} sem estoue disponível`);
            }
        }

    });

}