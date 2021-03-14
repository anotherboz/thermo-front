import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Charts from 'angular-google-charts'
import { BehaviorSubject, combineLatest, Observable, timer } from 'rxjs';
import { first, map, share, switchMap, tap } from 'rxjs/operators';
import { ServerService } from '../services/server.service';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import * as Model from '../models/models';

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
  dates: { from: Date; to: Date; }
  columns = [
    'date',
    'temperature'
  ];
  postClass = 'btn-primary';

  options = {
    curveType: 'function',
    legend: { position: 'bottom' }
  };

  formConfig = new FormGroup({
    min: new FormControl(0),
    max: new FormControl(0),
    redFrom: new FormControl(0),
    redTo: new FormControl(0),
    yellowFrom: new FormControl(0),
    yellowTo: new FormControl(0),
    minorTicks: new FormControl(5),
  });

  constructor(private route: ActivatedRoute, private server: ServerService) {
    this.from = new BehaviorSubject<Date>(moment().subtract(1, 'day').toDate());
    this.to = new BehaviorSubject<Date>(new Date());
    this.dates = { from: new Date(), to: new Date() };
  }

  ngOnInit(): void {
    this.node$ = combineLatest([
      this.from,
      this.to,
      this.route.params
    ]).pipe(
      switchMap(([from, to, params]) => this.server.getTherm(params.id, this.from.value, this.to.value)),
      tap((node: Model.Node) => {
        this.formConfig.patchValue({
          min: node.config.min,
          max: node.config.max,
          redFrom: node.config.redFrom,
          redTo: node.config.redTo,
          yellowFrom: node.config.yellowFrom,
          yellowTo: node.config.yellowTo,
          minorTicks: node.config.minorTicks,
        })
      }),
    );

    this.title$ = this.node$.pipe(map(node => node.nom));

    this.data$ = this.node$.pipe(
      map(node => node.temperatures.map(t => [t.date, t.value])),
    );
  }

  dateChange(dates: { from: Date; to: Date; }) {
    this.from.next(dates.from);
    this.to.next(dates.to);
  }

  onSubmit(): void {
    this.server.postNodeConfig(this.route.snapshot.params.id, this.formConfig.getRawValue())
      .subscribe(success => {
        this.postClass = success ? 'btn-success' : 'btn-danger';
        timer(1000).pipe(first()).subscribe(_ => this.postClass = 'btn-primary');
      });
  }
}
