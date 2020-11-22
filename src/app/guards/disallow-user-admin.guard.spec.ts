import { TestBed } from '@angular/core/testing';

import { DisallowUserAdminGuard } from './disallow-user-admin.guard';

describe('DisallowUserAdminGuard', () => {
  let guard: DisallowUserAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DisallowUserAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
