import { TestBed } from '@angular/core/testing';

import { OnlyLoggedInGuard } from './only-logged-in.guard';

describe('OnlyLoggedInGuard', () => {
  let guard: OnlyLoggedInGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OnlyLoggedInGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
