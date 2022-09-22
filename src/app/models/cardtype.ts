export class Cardtype {
    public id: string;
    public name: string;
    public active: boolean;
}

export class TypeUpgrade {
    public id: string;
    public to: string;
    public from: string;
    public active: boolean;
    public add_price: number;
}
