import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeColorPage } from './change-color.page';

describe('ChangeColorPage', () => {
  let component: ChangeColorPage;
  let fixture: ComponentFixture<ChangeColorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeColorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeColorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
