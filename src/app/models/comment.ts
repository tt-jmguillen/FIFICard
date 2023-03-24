import { Timestamp } from "@angular/fire/firestore";

export class ECardComment {
    public id: string;
    public message: string;
    public fontstyle: string;
    public fontcolor: string;
    public fontsize: number;
    public user: string;
    public created: Timestamp;
}
