import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

class Box {
  public id: number;
  public x: number;
  public y: number;
  public w: number;
  public h: number;

  public text: string;
  public font: string
  public fontsize: number;

  constructor(_id: number, _x: number, _y: number, _w: number, _h: number) {
    this.id = _id;
    this.x = _x;
    this.y = _y;
    this.w = _w;
    this.h = _h;
  }
}

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {
  @ViewChild('main', { static: true }) main: ElementRef;
  @ViewChild('content', { static: true }) content: TemplateRef<any>;

  private context: CanvasRenderingContext2D;
  image = new Image();
  boxes: Box[] = [];
  fontStyles : string[] = ['Calibri', 'Times New Roman', 'Garamond', 'Arial', 'Helvetica', 'Cambria', 'Trebuchet MS', 'Georgia', 'Tahoma', 'Didot']

  selectedBox: Box;

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.boxes.push(
      new Box(1, 200, 150, 400, 120)
    );
    this.boxes.push(
      new Box(2, 200, 300, 400, 120)
    )

    this.context = this.main.nativeElement.getContext('2d');

    this.image.src = "/assets/images/index.png";
    this.image.onload = () => {
      this.context.drawImage(this.image, 0, 0);

      this.boxes.forEach(box => {
        this.context.beginPath();
        this.context.rect(box.x, box.y, box.w, box.h);
        this.context.strokeStyle = "#FF0000";
        this.context.stroke();
      });

      this.context.save();
    }

    this.main.nativeElement.addEventListener('mousedown', (e: { clientX: number; clientY: number; }) => {
      this.getCursorPosition(e);
    });
  }

  getCursorPosition(event: { clientX: number; clientY: number; }) {
    const rect = this.main.nativeElement.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    this.boxes.forEach(box => {
      let passX: boolean = ((box.x < x) && ((box.x + box.w) > x));
      let passY: boolean = ((box.y < y) && ((box.y + box.h) > y));

      if (passX && passY) {
        this.openEditor(box);
      }
    });
  }

  openEditor(box: Box) {
    this.selectedBox = box;
    this.modalService.open(this.content);
  }

  onKeyUpEvent(event: any) {
    this.boxes[this.boxes.indexOf(this.selectedBox)].text = event.target.value;
    this.updateText();
  }

  onChangeEvent(event: any){
    this.boxes[this.boxes.indexOf(this.selectedBox)].font = event.target.value;
    this.updateText();
  }

  updateText() {
    this.context.restore();
    this.boxes.forEach(box => {
      if (box.text) {
        this.context.font = "20pt " + box.font?box.font:this.fontStyles[0];
        this.context.fillStyle = "#000000";
        this.context.fillText(box.text, box.x + 2, box.y + 20, box.w - 4);
      }
    });
  }

}
