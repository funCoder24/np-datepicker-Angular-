import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpDatepickerComponent } from './np-datepicker.component';

describe('NpDatepickerComponent', () => {
  let component: NpDatepickerComponent;
  let fixture: ComponentFixture<NpDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
