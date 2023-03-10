import { Timestamp } from "@angular/fire/firestore";

export class OrderECard {
    public id: string;
    public user_id: string;
    public card_id: string;
    public card_price: number;
    public location: 'ph' | 'sg' | 'us';
    public sender_name: string;
    public sender_phone: string;
    public sender_email: string;
    public receiver_name: string;
    public receiver_phone: string;
    public receiver_email: string;
    public message: string;
    public fontstyle: string;
    public fontcolor: string;
    public fontsize: number;
    public alignment: 'left' | 'center' | 'right';
    public isPaid: Boolean;
    public paymentId: string;
    public sentid: string;
    public confirmid: string;
    public start: Timestamp;
    public expire: Timestamp;
    public openedid: string;
    public created: Timestamp;
}
