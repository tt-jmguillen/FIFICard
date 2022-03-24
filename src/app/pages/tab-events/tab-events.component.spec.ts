import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabEventsComponent } from './tab-events.component';

describe('TabEventsComponent', () => {
  let component: TabEventsComponent;
  let fixture: ComponentFixture<TabEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabEventsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
