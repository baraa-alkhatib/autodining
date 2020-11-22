import { TestBed } from '@angular/core/testing';

import { DisallowUserRegularGuard } from './disallow-user-regular.guard';

describe('DisallowUserRegularGuard', () => {
  let guard: DisallowUserRegularGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DisallowUserRegularGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
