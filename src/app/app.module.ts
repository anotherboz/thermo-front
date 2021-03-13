import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import '@angular/common/locales/global/fr';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MainComponent } from './main/main.component';
import { GoogleChartsModule } from 'angular-google-charts';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './ui/navbar/navbar.component';
import { CookieService } from 'ngx-cookie-service';
import { AppRouterModule } from './router/app.router.module';
import { SondeComponent } from './sonde/sonde.component';
import { DatePickerComponent } from './main/date-picker/date-picker.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NavbarComponent,
    SondeComponent,
    DatePickerComponent
  ],
  imports: [
    AppRouterModule,
    GoogleChartsModule,
    BrowserModule,
    NgbModule,
    HttpClientModule,
  ],
  providers: [ CookieService, { provide: LOCALE_ID, useValue: 'fr-FR' } ],
  bootstrap: [AppComponent]
})
export class AppModule { }
