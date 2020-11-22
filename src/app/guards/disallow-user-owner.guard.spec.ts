import { TestBed } from '@angular/core/testing';

import { DisallowUserOwnerGuard } from './disallow-user-owner.guard';

describe('DisallowUserOwnerGuard', () => {
  let guard: DisallowUserOwnerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DisallowUserOwnerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
