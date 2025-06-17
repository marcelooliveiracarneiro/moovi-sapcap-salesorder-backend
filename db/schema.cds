using { managed, User } from '@sap/cds/common';

namespace sales;

entity SaledOrderHeaders: managed {
    key id          : UUID;
        totalAmount : Decimal(15, 2);
        customer    : Association to Customers;
        status : Association to SaledOrderStatuses;
        items       : Composition of many SaledOrderItems on items.header = $self;
}

entity SaledOrderStatuses {
    key id: String enum {
        COMPLETED = 'COMPLETED';
        PENDING = 'PENDING';
        REJECTED = 'REJECTED';
    };
    description: localized String;
}

entity SaledOrderItems : managed {
    key id       : UUID;
        header   : Association to SaledOrderHeaders;
        product  : Association to Products;
        quantity : Integer;
        price    : Decimal(15, 2);
}

entity Customers : managed {
    key id        : UUID;
        firstName : String(20);
        lastName  : String(100);
        email     : String(255);
}

entity Products : managed {
    key id    : UUID;
        name  : String(255);
        price : Decimal(15, 2);
        stock: Integer;
}

entity SaledOrderLogs: managed {
    key id: UUID;
        header: Association to SaledOrderHeaders;
        orderData: LargeString;
        userData: LargeString;
}