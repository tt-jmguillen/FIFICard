import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabCreationsComponent } from './tab-creations.component';

describe('TabCreationsComponent', () => {
  let component: TabCreationsComponent;
  let fixture: ComponentFixture<TabCreationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabCreationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabCreationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
