import cds from '@sap/cds';

import { CustomerProps, CustomerModel } from 'srv/models/customer';
import { CustomerRepository } from './protocols';

export class CustomerRepositoryImpl implements CustomerRepository {

    public async findById(id: CustomerProps['id']): Promise<CustomerModel | null> {
        const selectQuery  = SELECT.one.from('sales.Customers').where({ id: id });
        const selectResult = await cds.run(selectQuery);
        if (!selectResult) {
            return null;
        }
            
        return CustomerModel.with({
            id: selectResult.id as string,
            firstName: selectResult.firstName as string,
            lastName: selectResult.lastName as string,
            email: selectResult.email as string
        });
    }

}
