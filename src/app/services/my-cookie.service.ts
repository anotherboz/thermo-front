import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class MyCookieService {

  constructor(private cookieService: CookieService) { }

  get hideThermo(): number[] {
    const hideThermo = this.cookieService.get('hideThermo');
    if (hideThermo == null || hideThermo.length === 0) {
      return [];
    }
    return JSON.parse(hideThermo);
  }

  set hideThermo(ids: number[]) {
    this.cookieService.set('hideThermo', JSON.stringify(ids ?? []));
  }
}
