import { UploadTask } from '@angular/fire/storage';
import { ImageService } from 'src/app/services/image.service';
import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.scss']
})
export class PhotoUploadComponent implements OnInit {
  @Input() set image(_image: string){
    if (_image != '')
      this.loadImage(_image);
    else{
      this.url = '';
      this.status = 'NOIMAGE';
    }
  }
  @Output() onChange: EventEmitter<string> = new EventEmitter();

  imageService: ImageService;
  ref: ChangeDetectorRef;

  constructor(
    _imageService: ImageService,
    _ref: ChangeDetectorRef
  ) {
    this.imageService = _imageService;
    this.ref = _ref;
  }

  status: 'NOIMAGE' | 'UPLOADING' | 'WITHIMAGE' = 'NOIMAGE';
  percentage: number = 0;
  url: string = '';

  ngOnInit(): void {
  }

  onUpload(event: any) {
    this.status = 'UPLOADING';
    let uploadTask: UploadTask = this.imageService.upload(event.target.files[0]);
    uploadTask.on('state_changed',
      snapshot => {
        this.percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.ref.detectChanges();
      },
      error => {
        //
      },
      () => {
        this.onChange.emit(uploadTask.snapshot.ref.fullPath);
        this.loadImage(uploadTask.snapshot.ref.fullPath);
        this.ref.detectChanges();
      });
  }

  loadImage(image: string) {
    this.status = 'WITHIMAGE';
    this.ref.detectChanges();
    this.imageService.getImageURL(image).then(url => {
      this.url = url;
      this.ref.detectChanges();
    })
  }
}
