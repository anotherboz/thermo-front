import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SondeComponent } from "../sonde/sonde.component";
import { MainComponent } from "../main/main.component";


const appRoutes: Routes = [
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