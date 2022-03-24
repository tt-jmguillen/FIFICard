import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabStickersComponent } from './tab-stickers.component';

describe('TabStickersComponent', () => {
  let component: TabStickersComponent;
  let fixture: ComponentFixture<TabStickersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabStickersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabStickersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
