type CustomerProps = {
    id: String;
    firstName: String;
    lastName: String;
    email: String;

}

export class CustomerModel {
    constructor(private props: CustomerProps) { }

    public static Create(props: CustomerProps): CustomerModel {
        return new CustomerModel(props);
    }

    public get id() {
        return this.props.id;
    }
    public get firstName() {
        return this.props.firstName;
    }
    public get lastName() {
        return this.props.lastName;
    }
    public get email() {
        return this.props.email;
    }

    public toObject(): CustomerProps {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
        }
    }

    public setDefaultEmailDomain(): CustomerModel {
        if (!this.props.email?.includes('@')) {
            this.props.email = `${this.props.email}@gmail`;
        }
        return this;
    }

}
