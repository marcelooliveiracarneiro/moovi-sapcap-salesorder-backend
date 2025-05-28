using { sales } from '../db/schema';

service MainService {
    entity SaledOrderHeaders as projection on sales.SaledOrderHeaders;
}