export type ProductProps = {
    id: string;
    name: string;
    price: number;
    stock: number;
}

export type SellValidationResult = {
    hasError: boolean;
    error?: Error;
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
        };
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
    public set stock(stock: number) {
        this.stock = stock;
    }

    public sell(amount: number): SellValidationResult {
        if (this.stock < amount) {
            return { hasError: true, error: new Error('Quantidade em estoque, insuficiente.') };
        }
        return { hasError: false };
    }
    
}
