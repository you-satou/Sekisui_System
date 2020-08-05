import { TestBed } from '@angular/core/testing';

import { WkAllItemTypesService } from './wk-all-item-types.service';

describe('WkAllItemTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WkAllItemTypesService = TestBed.get(WkAllItemTypesService);
    expect(service).toBeTruthy();
  });
});
