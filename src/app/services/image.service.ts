import { Injectable } from '@angular/core';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  storage: Storage;

  constructor(
    private _storage: Storage
  ) { 
    this.storage = _storage
  }

  async getImageURL(path: string): Promise<string> {
    const fileRef = ref(this.storage, path);
    return getDownloadURL(fileRef)
  }
}
