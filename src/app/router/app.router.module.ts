import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SondeComponent } from "../sonde/sonde.component";
import { MainComponent } from "../main/main.component";
import { ConfigComponent } from "../config/config.component";


const appRoutes: Routes = [
  { path: 'config', component: ConfigComponent },
  { path: 'sonde/:id', component: SondeComponent },
  { path: '', component: MainComponent },
  ];


@NgModule({
    imports: [
      RouterModule.forRoot(
        appRoutes,
//        { enableTracing: true } // <-- debugging purposes only
      )
    ],
    exports: [
        RouterModule
    ]
  })
  export class AppRouterModule { }