import { TestBed } from '@angular/core/testing';

import { SailgpService } from './sailgp.service';

describe('SailgpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SailgpService = TestBed.get(SailgpService);
    expect(service).toBeTruthy();
  });
});
