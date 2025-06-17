import cds from '@sap/cds';

import { ProductProps, ProductModel } from 'srv/models/product';
import { ProductRepository } from './protocols';

export class ProductRepositoryImpl implements ProductRepository {

    public async findById(id: ProductProps['id']): Promise<ProductModel | null> {
        const selectQuery = SELECT.from('sales.Products').where({ id: id });
        const selectResult = await cds.run(selectQuery);
        if (!selectResult) {
            return null;
        }

        return ProductModel.with({
            id: selectResult.id as string,
            name: selectResult.firstName as string,
            price: selectResult.price as number,
            stock: selectResult.stock as number
        });
    }

    public async findByIds(ids: ProductProps['id'][]): Promise<ProductModel[] | null> {
        const selectQuery = SELECT.from('sales.Products').where({ id: ids });
        const selectResult = await cds.run(selectQuery);
        if (!selectResult) {
            return null;
        }

        return selectResult.map((selectResultItem: { id: string; firstName: string; price: number; stock: number; }) => ProductModel.with({
            id: selectResultItem.id as string,
            name: selectResultItem.firstName as string,
            price: selectResultItem.price as number,
            stock: selectResultItem.stock as number
        }));
    }

    public async updateStock(product: ProductModel): Promise<void> {
        await cds.update('sales.Products').where({ id: product.id }).with({ stock: product.stock });
    }


}
