using cap_tutorial as db from '../db/data-model';

service CatalogService {

    entity SalesOrders as projection on db.SalesOrders;

}