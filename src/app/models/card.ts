import { Timestamp } from "@angular/fire/firestore";

export class Card {
  public id?: string;
  public name? : string;
  public description?: string;
  public details?: string;
  public price?: number;
  public event?: string;
  public events?: string[];
  public recipient?: string;
  public recipients?: string[];
  public active?: boolean;
  public created?: Timestamp;
  public modified?: Timestamp;
  public images?: string[];
  public primary?: string;
}
