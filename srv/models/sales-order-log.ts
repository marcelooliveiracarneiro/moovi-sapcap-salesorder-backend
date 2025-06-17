export type SalesOrderLogProps = {
    id: String;
    headerId: String;
    orderData: String;
    userData: String;
}

type SalesOrderLogPropsOmit = Omit<SalesOrderLogProps, 'id'>;
type SalesOrderLogDbProps = Omit<SalesOrderLogProps, 'headerId'> & {
    header_id: String;
};

export class SalesOrderLogModel {
    constructor(private props: SalesOrderLogProps) { }

    public static Create(props: SalesOrderLogPropsOmit): SalesOrderLogModel {
        return new SalesOrderLogModel({
            ...props,
            id: crypto.randomUUID(),
        });
    }

    public static with(props: SalesOrderLogProps): SalesOrderLogModel {
        return new SalesOrderLogModel(props);
    }

    public toObject(): SalesOrderLogDbProps {
        return {
            id: this.id,
            header_id: this.headerId,
            orderData: this.orderData,
            userData: this.userData
        }
    }

    public get id() {
        return this.props.id;
    }
    public get headerId() {
        return this.props.headerId;
    }
    public get orderData() {
        return this.props.orderData;
    }
    public get userData() {
        return this.props.userData;
    }

}