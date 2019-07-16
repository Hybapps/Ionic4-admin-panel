import { TestBed } from '@angular/core/testing';

import { CrudProviderService } from './crud-provider.service';

describe('CrudProviderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CrudProviderService = TestBed.get(CrudProviderService);
    expect(service).toBeTruthy();
  });
});
