import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormreciboComponent } from './formrecibo.component';

describe('FormreciboComponent', () => {
  let component: FormreciboComponent;
  let fixture: ComponentFixture<FormreciboComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormreciboComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormreciboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
