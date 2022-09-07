import { Timestamp } from "@angular/fire/firestore";

export class Card {
  public id?: string;
  public name?: string;
  public description?: string;
  public details?: string;
  public price?: number;
  public event?: string;
  public events?: string[];
  public types?: string[];
  public recipient?: string;
  public recipients?: string[];
  public active?: boolean;
  public bestseller?: boolean;
  public featured?: boolean;
  public created?: Timestamp;
  public modified?: Timestamp;
  public images?: string[];
  public primary?: string;
  public favorites?: string[];
  public imageUrl?: string;
  public ratings?: number;
  public signAndSend?: boolean;
  public orders: string[] = [];
}


