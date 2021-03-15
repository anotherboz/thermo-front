import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { timer } from 'rxjs';
import { first } from 'rxjs/operators';
import { ServerService } from '../services/server.service';
import * as Model from '../models/models';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {
  @ViewChild('editUserSwal') swal: SwalComponent;

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

  editUser(user: Model.User): void {
    const nodes = new FormGroup({});  
    this.nodes.forEach(n => {
      nodes.addControl(n.id.toString(), new FormControl(user.nodeIds.length === 0 || user.nodeIds.includes(n.id)));
    });

    this.editUserForm = new FormGroup({
      mail: new FormControl(user.mail),
      limit: new FormControl(user.limit),
      nodes,
    });

    this.swal.fire().then(value => {
      if (value.isConfirmed) {
        this.sendUser(user.id);
      }
    });
  }

  addUser() {
    const nodes = new FormGroup({});  
    this.nodes.forEach(n => {
      nodes.addControl(n.id.toString(), new FormControl(false));
    });

    this.editUserForm = new FormGroup({
      mail: new FormControl(''),
      limit: new FormControl(''),
      nodes,
    });
    this.swal.fire().then(value => {
      if (value.isConfirmed) {
        this.sendUser();
      }
    });
  }

  sendUser(id?: number): void {
    let newUser = this.editUserForm.getRawValue();
    const nodesArray = [];
    for (let key in newUser.nodes) {
      if (newUser.nodes[key]) {
        nodesArray.push(Number.parseInt(key));
      }
    }
    // console.log({...newUser, id: id, nodes: nodesArray});
    if (id) {
      this.server.patchUser(this.password, {...newUser, id, nodes: nodesArray});
    } else {
      this.server.postUser(this.password, {...newUser, id, nodes: nodesArray});
    }
  }
}
