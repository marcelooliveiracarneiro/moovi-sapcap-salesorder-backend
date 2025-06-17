import { Products, SaledOrderHeader, SaledOrderItem } from "@models/sales";
import { SalesOrderHeaderService, CreationSalesOrderResult } from "./protocols";
import { ProductModel } from "../../models/product";
import { SalesOrderHeaderModel } from "../../models/sales-order-header";
import { SalesOrderItemModel } from "../../models/sales-order-item";
import { ProductRepository } from "../../repositories/product/protocols";
import { CustomerRepository } from "srv/repositories/customer/protocols";
import { CustomerModel } from "srv/models/customer";

export class SalesOrderHeaderServiceImpl implements SalesOrderHeaderService {
    constructor( 
        private readonly customerRepository: CustomerRepository,
        private readonly productRepository: ProductRepository
    ) { }

    public async beforeCreate(params: SaledOrderHeader): Promise<CreationSalesOrderResult> {

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

    private getCustomer(params: SaledOrderHeader) : Promise<CustomerModel | null> {
        const customerId = params.customer_id as string;
        return this.customerRepository.findById(customerId);
    }

}