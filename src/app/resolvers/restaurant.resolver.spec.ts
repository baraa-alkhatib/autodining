import { TestBed } from '@angular/core/testing';

import { RestaurantResolver } from './restaurant.resolver';

describe('RestaurantResolver', () => {
  let resolver: RestaurantResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(RestaurantResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
