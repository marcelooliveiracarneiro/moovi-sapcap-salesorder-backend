import { ProductModel, ProductProps } from "srv/models/product";

export interface ProductRepository {
    findById(id: ProductProps['id']): Promise<ProductModel | null>;
    findByIds(ids: ProductProps['id'][]): Promise<ProductModel[] | null> ;
}