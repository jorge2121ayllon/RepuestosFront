import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodigobarraComponent } from './codigobarra.component';

describe('CodigobarraComponent', () => {
  let component: CodigobarraComponent;
  let fixture: ComponentFixture<CodigobarraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodigobarraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodigobarraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
