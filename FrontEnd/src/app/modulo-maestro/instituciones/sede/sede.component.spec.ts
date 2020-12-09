import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SedeComponent } from './sede.component';

describe('SedeComponent', () => {
  let component: SedeComponent;
  let fixture: ComponentFixture<SedeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SedeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SedeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
