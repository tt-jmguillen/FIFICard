export class Cart {
    public orderid: string;
    public cardname: string;
    constructor(_orderid: string, _cardname: string){
        this.orderid = _orderid;
        this.cardname = _cardname;
    }
}
