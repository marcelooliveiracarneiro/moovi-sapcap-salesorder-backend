using {sales} from '../db/schema';

@requires: 'authenticated-user'
service MainService {
    entity SaledOrderHeaders as projection on sales.SaledOrderHeaders;
    entity Customers         as projection on sales.Customers;
    entity Products          as projection on sales.Products;
}
