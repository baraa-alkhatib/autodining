import { TestBed } from '@angular/core/testing';
import { ComposeUrlInterceptor } from './compose-url.interceptor';

describe('ComposeUrlInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [ComposeUrlInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: ComposeUrlInterceptor = TestBed.inject(ComposeUrlInterceptor);

    expect(interceptor).toBeTruthy();
  });
});
