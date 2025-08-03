import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockFechaComponent } from './stock-fecha.component';

describe('StockFechaComponent', () => {
  let component: StockFechaComponent;
  let fixture: ComponentFixture<StockFechaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockFechaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StockFechaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
