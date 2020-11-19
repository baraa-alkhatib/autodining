import { TestBed } from '@angular/core/testing';

import { OnlyLoggedOutGuard } from './only-logged-out.guard';

describe('OnlyLoggedOutGuard', () => {
  let guard: OnlyLoggedOutGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OnlyLoggedOutGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
