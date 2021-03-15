import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { timer } from 'rxjs';
import { first } from 'rxjs/operators';
import { ServerService } from '../services/server.service';
import * as Model from '../models/models';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  connected = false;
  password: string;
  buttonClass = 'btn-primary';
  users: { id: number, mail: string;  limit: string; nodeIds:number[], nodeNames: string[] }[]
  nodes: Model.Node[];

  formGroup = new FormGroup({
    loginControl: new FormControl('', { updateOn: 'submit' }),    
  });

  editUserForm = new FormGroup({
    mail: new FormControl(),
    limit: new FormControl(),
  });

  constructor(private server: ServerService) { }

  ngOnInit(): void { }

  onSubmit() {
    this.password = this.formGroup.get('loginControl').value;
    this.server.getUsers(this.password).subscribe(
      users => {
        this.server.getNodes().subscribe(nodes => {
          this.users = users.map(user => ({...user, 
           nodeNames: user.nodeIds.length ? nodes.filter(n => user.nodeIds.includes(n.id)).map(n => n.nom) : nodes.map(n => n.nom)
          }));
          this.nodes = nodes;
          this.connected = true;
        });
      },
      error => {
        this.buttonClass='btn-danger';
        timer(1000).pipe(first()).subscribe(_ => this.buttonClass='btn-primary');
      }
    )
  }

  swalUser(user: { mail: string;  limit: string; nodeIds:number[] }): void {
    const nodes = new FormGroup({});  
    this.nodes.forEach(n => {
      nodes.addControl(n.id.toString(), new FormControl(user.nodeIds.length === 0 || user.nodeIds.includes(n.id)));
    });

    this.editUserForm = new FormGroup({
      mail: new FormControl(user.mail),
      limit: new FormControl(user.limit),
      nodes: nodes,
    });
  }

  editUser(user: { id: number, mail: string;  limit: string; nodeIds:number[] }): void {
    let newUser = this.editUserForm.getRawValue();
    const nodesArray = [];
    for (let key in newUser.nodes) {
      if (newUser.nodes[key]) {
        nodesArray.push(Number.parseInt(key));
      }
    }
//  console.log({...newUser, id: user.id, nodes: nodesArray});
    this.server.postUser(this.password, {...newUser, id: user.id, nodes: nodesArray});
  }
}
