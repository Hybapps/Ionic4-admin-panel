import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageListPage } from './language-list.page';

describe('LanguageListPage', () => {
  let component: LanguageListPage;
  let fixture: ComponentFixture<LanguageListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LanguageListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
