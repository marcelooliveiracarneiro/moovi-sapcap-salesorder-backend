using {sales} from '../../db/schema';
using from '../../annotations/main';

@requires: 'authenticated-user'
service MainService {
    entity SaledOrderHeaders as projection on sales.SaledOrderHeaders;
/*     @restrict: [
        {
            grant: 'READ',
            to: 'read_only_user'
        },
        {
            grant: ['READ','WRITE'],
            to: 'admin'
        }
    ]
 */    
    entity SaledOrderStatuses as projection on sales.SaledOrderStatuses;
    entity Customers         as projection on sales.Customers;
    entity Products          as projection on sales.Products;
    entity SaledOrderLogs    as projection on sales.SaledOrderLogs;
}
