import { SalesOrderItemModel, SalesOrderItemProps } from "./sales-order-item";

export type SalesOrderHeaderProps = {
    id: String;
    customerId: String;
    totalAmount: number;
    items: SalesOrderItemModel[];
}

type SalesOrderHeaderPropsOmit = Omit<SalesOrderHeaderProps, 'id' | 'totalAmount'>;

type CreationPayload = {
    customer_id: SalesOrderHeaderProps['customerId'];
    items?: any[];
}

type CreationPayloadValidationResult = {
    hasError: boolean;
    error?: Error;
}

export class SalesOrderHeaderModel {
    constructor(private props: SalesOrderHeaderProps) { }

    public static Create(props: SalesOrderHeaderPropsOmit): SalesOrderHeaderModel {
        return new SalesOrderHeaderModel({
            ...props,
            id: crypto.randomUUID(),
            totalAmount: 0
        });
    }

    public static with(props: SalesOrderHeaderProps): SalesOrderHeaderModel {
        return new SalesOrderHeaderModel(props);
    }


    public get id() {
        return this.props.id;
    }
    public get customerId() {
        return this.props.customerId;
    }
    public get totalAmount() {
        return this.props.totalAmount;
    }
    public set totalAmount(amount: number) {
        this.props.totalAmount = amount;
    }
    public get items() {
        return this.props.items;
    }

    /*
        validadeCreationPayload
    */
    public validadeCreationPayload(params: CreationPayload): CreationPayloadValidationResult {

        // Customer
        const validationResultCustomer = this.validadeCreationCustomer(params.customer_id);
        if (validationResultCustomer.hasError) {
            return validationResultCustomer;
        };

        // Items
        const validationResultItems = this.validadeCreationItems();
        if (validationResultItems.hasError) {
            return validationResultItems;
        };

        return { hasError: false };
    }

    /*
        validadeCreationCustomer
    */
    private validadeCreationCustomer(customerId: CreationPayload['customer_id']): CreationPayloadValidationResult {
        if (!customerId) {
            return { hasError: true, error: new Error('Invalid Customer') };
        };
        return { hasError: false };
    }

    /*
        validadeCreationItems
    */
    private validadeCreationItems(): CreationPayloadValidationResult {
        if ((!this.items) || (this.items?.length === 0)) {
            return { hasError: true, error: new Error('Items is Empty') };
        }
        const itemsErrors: string[] = [];
        this.items.forEach(item => {
            const validationResult = item.validadeCreationPayload({ product_id: item.productId });
            if (validationResult.hasError) {
                itemsErrors.push(validationResult.error?.message as string);
            }
        });
        if (itemsErrors.length > 0) {
            const itensErrorsString = itemsErrors.join('\n - ');
            return { hasError: true, error: new Error(itensErrorsString) };
        }
        return { hasError: false };
    }


    public calculateTotalAmount(): number {
        this.totalAmount = 0;
        this.items.forEach(item => {
            this.totalAmount += ((item.price as number) * (item.quantity as number));
        });
        return this.totalAmount;
    }

    public calculateDicount(): number {
        this.calculateTotalAmount();
        if (this.totalAmount > 30000) {
            const discount = (this.totalAmount * (10/100));
            this.totalAmount = this.totalAmount - discount;
        }
        return this.totalAmount;
    }

    public getProductsData(): { id: string; quantity: number }[] {
        return this.items.map(item => ({
            id: item.productId as string,
            quantity: item.quantity as number
        }));
    }

    public toStringtyObject(): String {
        return JSON.stringify(this.props);
    }
}