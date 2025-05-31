using {managed} from '@sap/cds/common';

namespace sales;

entity SaledOrderHeaders : managed {
    key id          : UUID;
        customer    : Association to Customers;
        totalAmount : Decimal(15, 2);
        items       : Composition of many SaledOrderItems
                          on items.header = $self;
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
