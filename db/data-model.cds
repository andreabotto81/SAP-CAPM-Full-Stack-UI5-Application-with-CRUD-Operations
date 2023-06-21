namespace cap_tutorial;

entity SalesOrders
{
    key soNumber : String;
    orderDate : Date;
    customerName : String(100);
    customerNumber : String(100);
    PoNumber : String(100);
    inquiryNumber : String(100);
    totalOrderItems : Integer;
}
