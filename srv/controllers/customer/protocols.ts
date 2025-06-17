import { Customers } from '@models/sales';

export interface CustomerController {
    afterRead(CustomerList: Customers): Customers;
}
