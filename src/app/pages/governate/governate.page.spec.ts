import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernatePage } from './governate.page';

describe('GovernatePage', () => {
  let component: GovernatePage;
  let fixture: ComponentFixture<GovernatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovernatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
