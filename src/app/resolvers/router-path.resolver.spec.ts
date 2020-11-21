import { TestBed } from '@angular/core/testing';

import { RouterPathResolver } from './router-path.resolver';

describe('RouterPathResolver', () => {
  let resolver: RouterPathResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(RouterPathResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
