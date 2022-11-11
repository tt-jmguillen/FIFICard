import { LightboxImage } from './lightbox-image';
import { Component, Input, OnInit, Renderer2, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-lightbox',
  templateUrl: './lightbox.component.html',
  styleUrls: ['./lightbox.component.scss']
})
export class LightboxComponent implements OnInit {
  @Input() set images(_images: LightboxImage[]) {
    this.loadImages(_images);
  }
  @Input() set title(_title: string) {
    this.cardtitle = _title;
  }
  @ViewChild('modal', { static: true }) modal: TemplateRef<LightboxComponent>;

  modalService: NgbModal;
  modalRef: NgbModalRef;
  renderer: Renderer2;
  globalListenFunc: Function;

  constructor(
    _modalService: NgbModal,
    _renderer: Renderer2
  ) {
    this.modalService = _modalService;
    this.renderer = _renderer;
  }

  items: LightboxImage[] = [];
  current: LightboxImage = new LightboxImage(0, '', '');
  cardtitle: string;

  ngOnInit(): void {
    this.globalListenFunc = this.renderer.listen('document', 'keydown', e => {
      if (e.key == 'ArrowLeft') {
        this.prev();
      }
      if (e.key == 'ArrowRight') {
        this.next();
      }
    });
  }

  loadImages(_images: LightboxImage[]) {
    this.items = _images;
  }

  open(_id: number) {
    this.change(_id);
    this.modalRef = this.modalService.open(this.modal, { animation: true, fullscreen: true });
  }

  change(_id: number) {
    if (_id == 0) {
      if (this.current.id == 0) {
        this.current = this.items[this.items.findIndex(x => x.id == 1)];
      }
    }
    else {
      if (this.current.id != _id) {
        this.current = this.items[this.items.findIndex(x => x.id == _id)];
      }
    }
  }

  prev() {
    let id = this.current.id - 1;
    if (id == 0) {
      id = this.items.length;
    }
    this.current = this.items[this.items.findIndex(x => x.id == id)];
  }

  next() {
    let id = this.current.id + 1;
    if (id > this.items.length) {
      id = 1;
    }
    this.current = this.items[this.items.findIndex(x => x.id == id)];
  }

  close() {
    this.modalRef.close();
  }
}
