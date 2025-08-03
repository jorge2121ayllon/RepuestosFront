import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteventaComponent } from './reporteventa.component';

describe('ReporteventaComponent', () => {
  let component: ReporteventaComponent;
  let fixture: ComponentFixture<ReporteventaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteventaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteventaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
