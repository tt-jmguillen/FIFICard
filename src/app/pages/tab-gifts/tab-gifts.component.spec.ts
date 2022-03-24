import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabGiftsComponent } from './tab-gifts.component';

describe('TabGiftsComponent', () => {
  let component: TabGiftsComponent;
  let fixture: ComponentFixture<TabGiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabGiftsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabGiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
