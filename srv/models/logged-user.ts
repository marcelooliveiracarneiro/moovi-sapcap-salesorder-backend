type loggedUserProps = {
    id: string;
    roles: string[];
    attributes: loggedUserAttributes;
}

type loggedUserAttributes = {
    id: number;
    groups: string[]; 
}

export class LoggedUserModel {
    constructor(private props: loggedUserProps) {}

    public static Create(props: loggedUserProps) {
        return new LoggedUserModel(props);
    }

    public get id() {
        return this.props.id;
    }
    public get roles() {
        return this.props.roles;
    }
    public get attributes() {
        return this.props.attributes;
    }

    public toStringtyObject(): string {
        return JSON.stringify(this.props);
    }

}

