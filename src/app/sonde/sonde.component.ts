import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Charts from 'angular-google-charts'
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ServerService } from '../services/server.service';
import * as moment from 'moment';

@Component({
  selector: 'app-sonde',
  templateUrl: './sonde.component.html',
  styleUrls: ['./sonde.component.scss']
})
export class SondeComponent implements OnInit {
  CANDLESTICK= Charts.ChartType.LineChart;
  node$: Observable<any>;
  data$: Observable<any>;
  title$: Observable<string>;
  from: BehaviorSubject<Date>;
  to: BehaviorSubject<Date>;
  columns = [
    'date',
    'temperature'
  ];

  options = {
    curveType: 'function',
    legend: { position: 'bottom' }
  };

  constructor(private route: ActivatedRoute, private server: ServerService) {
    this.from = new BehaviorSubject<Date>(moment().subtract(1, 'day').toDate());
    this.to = new BehaviorSubject<Date>(new Date());
  }

  ngOnInit(): void {
    this.node$ = combineLatest([
      this.from,
      this.to,
      this.route.params
    ]).pipe(
      switchMap(([from, to, params]) => this.server.getTherm(params.id, this.from.value, this.to.value))
    );

    this.title$ = this.node$.pipe(map(node => node.nom));

    this.data$ = this.node$.pipe(
      map(node => node.temperatures.map(t => [t.date, t.value])),
    );
  }
}
