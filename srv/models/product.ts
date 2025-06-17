export type ProductProps = {
    id: String;
    name: String;
    price: number;
    stock: number;
}

export class ProductModel {
    constructor(private props: ProductProps) { }

    public static with(props: ProductProps): ProductModel {
        return new ProductModel(props);
    }

    public toObject(): ProductProps {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            stock: this.stock,
        }
    }

    public get id() {
        return this.props.id;
    }
    public get name() {
        return this.props.name;
    }
    public get price() {
        return this.props.price;
    }
    public get stock() {
        return this.props.stock;
    }

}
