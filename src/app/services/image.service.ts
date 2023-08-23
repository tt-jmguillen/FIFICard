import { Injectable } from '@angular/core';
import { getDownloadURL, list, ref, Storage, uploadBytesResumable, UploadTask } from '@angular/fire/storage';
import { resolve } from 'dns';

export interface ImageCache {
  id: string,
  value: string
}

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

  async getCacheImage(): Promise<ImageCache[]> {
    return new Promise(resolve => {
      let items = localStorage.getItem('fibeigalleryimagecache');
      if (items) resolve(JSON.parse(items) as ImageCache[]);
      else resolve([]);
    })
  }

  async setAddImageToCache(image: ImageCache) {
    let list: ImageCache[] = [];
    let items = localStorage.getItem('fibeigalleryimagecache');
    if (items) {
      list = JSON.parse(items) as ImageCache[]
    }
    list.push(image);
    localStorage.setItem("fibeigalleryimagecache", JSON.stringify(list));
  }

  async getImageURL(path: string): Promise<string> {
    return new Promise(async resolve => {
      let images: ImageCache[] = await this.getCacheImage();
      let image = images.find(x => x.id === path)
      if (image) {
        resolve(image.value);
      }
      else {
        const fileRef = ref(this.storage, path);
        let value = await getDownloadURL(fileRef);
        this.setAddImageToCache({ id: path, value: value });
        resolve(value);
      }
    });
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
