import { Injectable } from '@angular/core';
import { getDownloadURL, list, ref, Storage, uploadBytesResumable, UploadTask } from '@angular/fire/storage';

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

  private getRandomString(): string {
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for (var i = 0; i < 20; i++) {
      result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
  }

  upload(file: File): UploadTask {
    let id = this.getRandomString();
    const reference = ref(this.storage, 'orders/' + id);
    return uploadBytesResumable(reference, file);
  }
}
