import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VendedoresListadoComponent } from './vendedores-listado.component';

describe('VendedoresListadoComponent', () => {
  let component: VendedoresListadoComponent;
  let fixture: ComponentFixture<VendedoresListadoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VendedoresListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendedoresListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
