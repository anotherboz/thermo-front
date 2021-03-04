import { Component, OnInit } from '@angular/core';
import { ServerService } from '../services/server.service';
import * as Model from '../models/models';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import * as Charts from 'angular-google-charts'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  nodes$: Observable<Model.Node[]>;
  gauges$: Observable<any>;
  candlestick$: Observable<any>;
  candlestickOptions = { legend: 'none',};
  GAUGE =  Charts.ChartType.Gauge;
  CANDLESTICK= Charts.ChartType.CandlestickChart;
  columns = ['Label', 'Value'];

  constructor(private server: ServerService) {
  }

  ngOnInit(): void {
    this.nodes$ = this.server.getTherms(moment().subtract(1, 'day').toDate(), new Date());
    this.gauges$ = this.nodes$.pipe(map(nodes =>  nodes.map(node =>  ({
      config: { ...node.config,  width: '100%', height: '100%' },
      data: [[ node.nom, node.temperatures[node.temperatures.length - 1].value]]
     }))));

    // this.candlestick$ = this.nodes$.pipe(map(nodes => nodes.map(node => [ node.nom, ...node.temperatures.map(t => t.value) ])));
     this.candlestick$ = of([
      ['sonde1', 16, 20, 20, 21 ],
      ['sonde2', 14, 16, 18, 18 ],
      ['sonde3', 11, 12, 17, 21 ]
     ]);

    this.candlestick$.subscribe(l => console.log(l));

    // this.candlestick$ = of([
    //   ['Mon', 20, 28, 38, 45],
    //   ['Tue', 31, 38, 55, 66],
    //   ['Wed', 50, 55, 77, 80],
    //   ['Thu', 77, 77, 66, 50],
    //   ['Fri', 68, 66, 22, 15]
    // ])
  }
}
