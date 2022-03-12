import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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
    return this.server.get(this.serverUrl + `/therms/${from.toJSON()}/${to.toJSON()}`).pipe(
      map((nodes: Model.Node[]) => nodes.map(node => { return node; } ))
    ) as Observable<Model.Node[]>;
   }

   public getTherm(id: number, from: Date, to: Date): Observable<Model.Node> {
    return this.server.get(this.serverUrl + `/therm/${id}/${from.toJSON()}/${to.toJSON()}`) as Observable<Model.Node>;
  }
  
  public postNodeConfig(id: number, config: Model.NodeConfig): Observable<boolean> {
    return this.server.post(this.serverUrl + `/node/${id}/config`, config)
    .pipe(
      catchError(err => { console.error(err); return of(false); }),      
      map(o => true)
    );
  }

  public getNodes(): Observable<Model.Node[]> {
    return this.server.get<Model.Node[]>(this.serverUrl + `/nodes`);
  }

  public getUsers(password: string): Observable<Model.User[]> {
    const headers = new HttpHeaders({
      authorization: 'Basic ' + btoa('super:' + password),
    })
    return this.server.get<Model.User[]>(this.serverUrl + '/users', { headers });
  }

  public patchUser(password: string, user: Model.User): Observable<boolean> {
    const headers = new HttpHeaders({
      authorization: 'Basic ' + btoa('super:' + password),
    })
    return this.server.patch(this.serverUrl + `user/${user.id}`, user, { headers, observe: 'response' })
      .pipe(map((res) => res.ok));
  }

  public postUser(password: string, user: Model.User): Observable<boolean> {
    const headers = new HttpHeaders({
      authorization: 'Basic ' + btoa('super:' + password),
    })
    return this.server.post(this.serverUrl + `user`, user, { headers, observe: 'response' })
      .pipe(map((res) => res.ok));
  }
}
