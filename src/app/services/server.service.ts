import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Model from '../models/models';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  private serverUrl: string;
  constructor(private server: HttpClient) {
    this.serverUrl = environment.serverUrl;
   }

   public getTherms(from: Date, to: Date): Observable<Model.Node[]> {

    return of([
      {
        id: 1,
        nom: 'sonde1',
        createdAt: new Date('2021-03-01 10:57:00'),
        config: { min: 15, max: 45 , redFrom: 35, redTo: 45, yellowFrom: 25, yellowTo: 35, minorTicks: 5 },
        temperatures:[
          { date: moment().hours(13).minutes(53).toDate(), value: 20.0 },
          { date: moment().hours(14).minutes(3).toDate(), value: 21.0 },
          { date: moment().hours(14).minutes(13).toDate(), value: 20.5 },
          { date: moment().hours(14).minutes(23).toDate(), value: 20.2 },
          { date: moment().hours(14).minutes(33).toDate(), value: 19.0 },
        ]
      },
      {
        id: 2,
        nom: 'sonde2',
        createdAt: new Date('2021-03-01 10:55:00'),
        config: { min: 0, max: 60 , redFrom: 35, redTo: 60, yellowFrom: 25, yellowTo: 35, minorTicks: 5 },
        temperatures:[
          { date: moment().hours(13).minutes(53).toDate(), value: 18.0 },
          { date: moment().hours(14).minutes(3).toDate(), value: 17.0 },
          { date: moment().hours(14).minutes(13).toDate(), value: 17.5 },
          { date: moment().hours(14).minutes(23).toDate(), value: 18.0 },
          { date: moment().hours(14).minutes(33).toDate(), value: 18.5 },
        ]
      },
      {
        id: 3,
        nom: 'sonde3',
        createdAt: new Date('2021-03-01 10:55:00'),
        config: { min: 0, max: 60 , redFrom: 35, redTo: 60, yellowFrom: 25, yellowTo: 35, minorTicks: 5 },
        temperatures:[
          { date: moment().hours(13).minutes(53).toDate(), value: 15.0 },
          { date: moment().hours(14).minutes(3).toDate(), value: 16.0 },
          { date: moment().hours(14).minutes(13).toDate(), value: 17.5 },
          { date: moment().hours(14).minutes(23).toDate(), value: 19.0 },
          { date: moment().hours(14).minutes(33).toDate(), value: 20.5 },
        ]
      },
      {
        id: 4,
        nom: 'sonde4',
        createdAt: new Date('2021-03-01 10:55:00'),
        config: { min: 0, max: 60 , redFrom: 35, redTo: 60, yellowFrom: 25, yellowTo: 35, minorTicks: 5 },
        temperatures:[
          { date: moment().hours(13).minutes(53).toDate(), value: 21.0 },
          { date: moment().hours(14).minutes(3).toDate(), value: 22.0 },
          { date: moment().hours(14).minutes(13).toDate(), value: 21.5 },
          { date: moment().hours(14).minutes(23).toDate(), value: 16.0 },
          { date: moment().hours(14).minutes(33).toDate(), value: 21.5 },
        ]
      },
      {
        id: 5,
        nom: 'sonde5',
        createdAt: new Date('2021-03-01 10:55:00'),
        config: { min: 0, max: 60 , redFrom: 35, redTo: 60, yellowFrom: 25, yellowTo: 35, minorTicks: 5 },
        temperatures:[
          { date: moment().hours(13).minutes(53).toDate(), value: 14.0 },
          { date: moment().hours(14).minutes(3).toDate(), value: 15.0 },
          { date: moment().hours(14).minutes(13).toDate(), value: 14.5 },
        ]
      },

    ]);

    return this.server.get(this.serverUrl + `/therms/${from.toJSON()}/${to.toJSON}`).pipe(
      map((nodes: Model.Node[]) => nodes.map(node => { return node; } ))
    ) as Observable<Model.Node[]>;
   }

   public getTherm(id: number, from: Date, to: Date): Observable<Model.Node> {
   return of(
      {
        id: 1,
        nom: 'sonde1',
        createdAt: new Date('2021-03-01 10:57:00'),
        config: { min: 15, max: 45 , redFrom: 35, redTo: 45, yellowFrom: 25, yellowTo: 35, minorTicks: 5 },
        temperatures:[
          { date: moment().hours(13).minutes(53).toDate(), value: 20.0 },
          { date: moment().hours(14).minutes(3).toDate(), value: 21.0 },
          { date: moment().hours(14).minutes(13).toDate(), value: 20.5 },
          { date: moment().hours(14).minutes(23).toDate(), value: 20.2 },
          { date: moment().hours(14).minutes(33).toDate(), value: 19.0 },
        ]
      },
    );

    return this.server.get(this.serverUrl + `/therm/${id}/${from.toJSON()}/${to.toJSON}`) as Observable<Model.Node>;
  }    
}
