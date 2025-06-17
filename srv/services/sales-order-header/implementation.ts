import { SaledOrderHeader, SaledOrderHeaders, SaledOrderItem } from '@models/sales';
import { SalesOrderHeaderService, CreationSalesOrderResult } from './protocols';
import { ProductModel } from '../../models/product';
import { SalesOrderHeaderModel } from '../../models/sales-order-header';
import { SalesOrderItemModel } from '../../models/sales-order-item';
import { ProductRepository } from '../../repositories/product/protocols';
import { CustomerRepository } from 'srv/repositories/customer/protocols';
import { CustomerModel } from 'srv/models/customer';
import { SalesOrderLogModel } from 'srv/models/sales-order-log';
import { SalesOrderLogRepository } from 'srv/repositories/sales-order-log/protocols';
import { User } from '@sap/cds';
import { LoggedUserModel } from 'srv/models/logged-user';

export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService {
    constructor(
        private readonly customerRepository: CustomerRepository,
        private readonly productRepository: ProductRepository,
        private readonly salesOrderLogRepository: SalesOrderLogRepository
    ) {}

    public async beforeCreate( params: SaledOrderHeader ): Promise<CreationSalesOrderResult> {

        // Produtos
        const products = await this.getListOfProduct(params);
        if (!products) {
            return { hasError: true, error: new Error('Nenhum produto da lista de itens foi encontrado.') };
        }
        const items = this.getListOfItem(params,products);
        const header = this.getHeader(params,items);
        const customer = await this.getCustomer(params);
        if (!customer) {
            return { hasError: true, error: new Error('Customer not found.') };            
        }
        const validationResult = header.validadeCreationPayload({ customer_id: customer.id });
        if (validationResult.hasError) {
            return validationResult;
        }
        return { 
            hasError: false,
            totalAmount: header.calculateDicount()
        };
    }

    public async afterCreate(params: SaledOrderHeaders, loggedUser: User): Promise<void> {
        const headersAsArray = Array.isArray(params) ? params : [params] as SaledOrderHeaders;
        const logs: SalesOrderLogModel[] =[];
        for (const header of headersAsArray) {
            const products = await this.getListOfProduct( header ) as ProductModel[];
            const items = this.getListOfItem( header, products );
            const salesOrderHeader = this.getExistingHeader( header, items );
            const productsData = salesOrderHeader.getProductsData();
            for (const product of products) {
                const productFound = productsData.find(productData => productData.id === product.id );
                product.sell(productFound?.quantity as number);
                await this.productRepository.updateStock(product);
            }
            const log = this.getSalesOrderLog(salesOrderHeader, this.getLoggedUser(loggedUser) );
            logs.push(log);
        }
        await this.salesOrderLogRepository.create(logs);
    }

    private async getListOfProduct(params: SaledOrderHeader): Promise<ProductModel[] | null> {
        const productsIds: string[] = params.items?.map((item: SaledOrderItem) => item.product_id) as string[];
        return this.productRepository.findByIds(productsIds);
    }

    private getListOfItem(params: SaledOrderHeader, products: ProductModel[]): SalesOrderItemModel[] {
        return params.items?.map(item => SalesOrderItemModel.Create({
            price: item.price as number,
            quantity: item.quantity as number,
            productId: item.product_id as string,
            products
        })) as SalesOrderItemModel[];
    }

    private getHeader(params: SaledOrderHeader, items: SalesOrderItemModel[]): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.Create({
            customerId: params.customer_id as string,
            items
        });
    }

    private getExistingHeader(params: SaledOrderHeader, items: SalesOrderItemModel[]): SalesOrderHeaderModel {
        return SalesOrderHeaderModel.with({
            id: params.id as string,
            customerId: params.customer_id as string,
            totalAmount: params.totalAmount as number,
            items
        });
    }


    private getCustomer(params: SaledOrderHeader) : Promise<CustomerModel | null> {
        const customerId = params.customer_id as string;
        return this.customerRepository.findById(customerId);
    }

    private getLoggedUser(loggedUser: User): LoggedUserModel {
        return LoggedUserModel.Create({
            id: loggedUser.id,
            roles: loggedUser.roles as string[],
            attributes: {
                id: loggedUser.attr.id as unknown as number,
                groups: loggedUser.attr.groups as unknown as string[]
            }
        });
    }

    private getSalesOrderLog(salesOrderHeader: SalesOrderHeaderModel, loggedUser: LoggedUserModel) : SalesOrderLogModel {
        return SalesOrderLogModel.Create({
            headerId: salesOrderHeader.id as string,
            orderData: salesOrderHeader.toStringtyObject(),
            userData:  loggedUser.toStringtyObject()
        });
    }

}
