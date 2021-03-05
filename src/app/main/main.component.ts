import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import * as Model from '../models/models';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import * as Charts from 'angular-google-charts'
import { MyCookieService } from '../services/my-cookie.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  nodes$: Observable<Model.Node[]>;
  gauges$: Observable<any>;
  candlestick$: Observable<any>;
  nodesFilter$: BehaviorSubject<number[]>;
  candlestickOptions = { legend: 'none', min:0 };
  GAUGE =  Charts.ChartType.Gauge;
  CANDLESTICK= Charts.ChartType.CandlestickChart;
  columns = ['Label', 'Value'];

  constructor(private server: ServerService, private myCookies: MyCookieService) {
    this.nodesFilter$ = new BehaviorSubject(myCookies.hideThermo);
  }

  ngOnInit(): void {
    this.nodes$ = combineLatest([
      this.nodesFilter$,
      this.server.getTherms(moment().subtract(1, 'day').toDate(), new Date()),
    ]).pipe(
      map(([filter, nodes]) => nodes.filter(n => !filter.includes(n.id))));

    this.gauges$ = this.nodes$.pipe(map(nodes =>  nodes.map(node =>  ({
      config: { ...node.config },
      id: node.id,
      data: [[ node.nom, node.temperatures[node.temperatures.length - 1].value]]
     }))));

    this.candlestick$ = this.nodes$.pipe(map(nodes => nodes.map(node => {
      const min = node.temperatures.reduce((min, current) => min < current.value ? min : current.value, node.temperatures[0].value);
      const max = node.temperatures.reduce((max, current) => max > current.value ? max : current.value, node.temperatures[0].value);
      return [ node.nom, min, min, max, max ];
    })));
  }

  hide(id: number) {
    const hide = [...this.nodesFilter$.value, id]
    this.nodesFilter$.next(hide);
    this.myCookies.hideThermo = hide;
  }

  showAll() {
    this.nodesFilter$.next([]);
    this.myCookies.hideThermo = [];
  }
}
