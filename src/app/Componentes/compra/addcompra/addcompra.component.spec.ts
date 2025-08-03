import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddcompraComponent } from './addcompra.component';

describe('AddcompraComponent', () => {
  let component: AddcompraComponent;
  let fixture: ComponentFixture<AddcompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddcompraComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddcompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
