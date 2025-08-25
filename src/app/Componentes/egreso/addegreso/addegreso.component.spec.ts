import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddegresoComponent } from './addegreso.component';

describe('AddegresoComponent', () => {
  let component: AddegresoComponent;
  let fixture: ComponentFixture<AddegresoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddegresoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddegresoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
