import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import * as Model from '../models/models';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import * as moment from 'moment';
import { map, tap } from 'rxjs/operators';
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
  linechart$: Observable<any>;
  nodesFilter$: BehaviorSubject<number[]>;
  candlestickOptions = { legend: 'none', min:0 };
  linechartOptions = { min: 0, legend: { position: 'bottom' } };
  GAUGE =  Charts.ChartType.Gauge;
  CANDLESTICK= Charts.ChartType.CandlestickChart;
  LINECHART = Charts.ChartType.LineChart;
  columns = ['Label', 'Value'];
  linechartColumns = [];

  dates: { from: Date; to: Date; }

  constructor(private server: ServerService, private myCookies: MyCookieService) {
    this.nodesFilter$ = new BehaviorSubject(myCookies.hideThermo);
    this.dates = { from: moment().startOf('day').toDate(), to: moment().endOf('day').toDate() };
  }

  ngOnInit(): void {
    this.nodes$ = combineLatest([
      this.nodesFilter$,
      this.server.getTherms(moment().subtract(1, 'day').toDate(), new Date()),
    ]).pipe(
      map(([filter, nodes]) => nodes.filter(n => !filter.includes(n.id))));

    this.gauges$ = this.nodes$.pipe(
      map(nodes =>  nodes.map(node =>  ({
      config: { ...node.config },
      id: node.id,
      data: [[ node.nom, node.temperatures[node.temperatures.length - 1]?.value ?? 0]]
     }))));

    this.candlestick$ = this.nodes$.pipe(map(nodes => nodes.map(node => {
    let min, max;
      if (node.temperatures && node.temperatures.length) {
        min = node.temperatures.reduce((min, current) => min < current.value ? min : current.value, node.temperatures[0].value);
        max = node.temperatures.reduce((max, current) => max > current.value ? max : current.value, node.temperatures[0].value);
      } else {
        min = 0;
        max = 0;
      }
      return [ node.nom, min, min, max, max ];
    })));

    this.linechart$ = this.nodes$.pipe(map(nodes => {
      this.linechartColumns = ['Heure', ...nodes.map(n => n.nom)]
      if (nodes.length > 0) {
        let datas: (string|number)[][] = [];
        // node[0] contains x axis time and temperature array count
        nodes[0].temperatures.forEach((t, index) => datas.push([
          t.date.toLocaleTimeString('FR-fr', {hour: '2-digit', minute:'2-digit'}),
          ...nodes.map(n => n.temperatures[index]?.value ?? 0) ]));
        return datas?.length ? datas : undefined;
      } else {
        return undefined;
      }
    }));
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
