import { TestBed } from '@angular/core/testing';

import { MyCookieService as MyCookieService } from './my-cookie.service';

describe('CookieService', () => {
  let service: MyCookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyCookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
