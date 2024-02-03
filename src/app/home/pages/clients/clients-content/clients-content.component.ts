import { Component } from '@angular/core';
import { JsonPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ClientRegisterComponent } from '../client-register/client-register.component';
import { GlobalHeaderComponent } from '../../../global-header/global-header.component';

import { ClientsService } from '../clients.service';

import { IGlobalHeaderData } from '../../../../../interfaces/global-header-data.interface';
import {
  ICLientColumnItem,
  IClient,
} from '../../../../../interfaces/client.interface';

import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAffixModule } from 'ng-zorro-antd/affix';
import { localStorageLabels } from '../../../../constants/localStorageLabels';
import { TypesOfDocumentsService } from '../../types-of-documents/types-of-documents.service';
import { ITypeDocument } from '../../../../../interfaces/type-document.interface';

@Component({
  selector: 'app-clients-content',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    JsonPipe,
    NgClass,
    RouterLink,
    ReactiveFormsModule,
    GlobalHeaderComponent,
    NzGridModule,
    NzTableModule,
    NzFormModule,
    NzSelectModule,
    NzAlertModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
    NzAffixModule,
  ],
  templateUrl: './clients-content.component.html',
  styleUrl: './clients-content.component.css',
})
export class ClientsContentComponent {
  public globalHeaderData: IGlobalHeaderData = {
    tittle: 'Clientes',
    backTo: { label: 'Volver a Home', route: '/admin/home' },
  };
  public clients: Array<IClient> = [];
  public clientsView: Array<IClient> = [];
  public searchValue = '';
  public visible = false;
  public allChecked = false;
  public indeterminate = true;
  // public documentTypes: Array<string> = [];
  public documentTypes: Array<ITypeDocument> = [];

  public listOfColumns: ICLientColumnItem[] = [];

  public documentNumbers: Array<string> = [];
  public names: Array<string> = [];
  public surnames: Array<string> = [];

  public filtDocumentTypeCondition: boolean = true;
  public filtDocumentNumberCondition: boolean = true;
  public filtNamesCondition: boolean = true;
  public filtSurNamesCondition: boolean = true;

  public clientPerDelete: IClient | null = null;
  public spinning: boolean = false;

  findClientsFilterForm = this._fb.group({
    documentType: [[], [Validators.required]],
    documentNumber: [[], [Validators.required]],
    names: [[], [Validators.required]],
    surnames: [[], [Validators.required]],
  });

  get tableData() {
    return this.clientsView;
  }

  get formControlDocumentType() {
    return this.findClientsFilterForm.controls['documentType'] as FormControl;
  }

  get formControlDocumentNumber() {
    return this.findClientsFilterForm.controls['documentNumber'] as FormControl;
  }

  get formControlNames() {
    return this.findClientsFilterForm.controls['names'] as FormControl;
  }

  get formControlSurnames() {
    return this.findClientsFilterForm.controls['surnames'] as FormControl;
  }

  constructor(
    private _fb: FormBuilder,
    private _clientsSvc: ClientsService,
    private _typesOfDocumentsService: TypesOfDocumentsService,
    private _message: NzMessageService,
    private _modalSvc: NzModalService
  ) {
    this._clientsSvc._storageSvc.set(localStorageLabels.spinning, 'true');
  }

  ngOnInit(): void {
    this.getTypesOfDocuments();
    this.getClients();
    this._clientsSvc._storageSvc.remove(localStorageLabels.client);
  }

  getClients(): void {
    this.spinning = true;
    this._clientsSvc.getClients().subscribe(
      (clients) => {
        this.documentTypes;
        this.clients = clients;
        this.clientsView = this.clients;
        this.initValueFilters(clients);
        this.spinning = false;
      },
      (err) => {
        console.log({ error: err });
        this.spinning = false;
      }
    );
  }

  getTypesOfDocuments(): void {
    this.spinning = true;
    this._typesOfDocumentsService.getDocumentTypes().subscribe(
      (documentTypes) => {
        this.documentTypes = documentTypes;
        this.spinning = false;
      },
      (err) => {
        console.log({ error: err });
        this.spinning = false;
      }
    );
  }

  initValueFilters(clients: Array<IClient>): void {
    this.listOfColumns = [
      {
        name: 'Tipo de documento',
        listOfFilter: this.documentTypes.map(function (documentType) {
          return { text: documentType.type, value: documentType.type };
        }),
        filterFn: (list: string[], item: IClient) =>
          list.some(
            (documentType) => item.documentType.indexOf(documentType) !== -1
          ),
      },
      {
        name: 'Numero de documento',
        listOfFilter: clients.map(function (client) {
          return {
            text: client.documentNumber,
            value: client.documentNumber,
          };
        }),
        filterFn: (list: string[], item: IClient) =>
          list.some(
            (documentNumber) =>
              item.documentNumber.indexOf(documentNumber) !== -1
          ),
      },
      {
        name: 'Nombres',
        listOfFilter: clients.map(function (client) {
          return { text: client.names, value: client.names };
        }),
        filterFn: (list: string[], item: IClient) =>
          list.some((names) => item.names.indexOf(names) !== -1),
      },
      {
        name: 'Apellidos',
        listOfFilter: clients.map(function (client) {
          return { text: client.surnames, value: client.surnames };
        }),
        filterFn: (list: string[], item: IClient) =>
          list.some((surnames) => item.surnames.indexOf(surnames) !== -1),
      },
      {
        name: 'Numero de celular',
        listOfFilter: clients.map(function (client) {
          return { text: client.phoneNumber, value: client.phoneNumber };
        }),
        filterFn: (list: string[], item: IClient) =>
          list.some(
            (phoneNumber) => item.phoneNumber.indexOf(phoneNumber) !== -1
          ),
      },
      {
        name: 'Correo',
        listOfFilter: clients.map(function (client) {
          return { text: client.email, value: client.email };
        }),
        filterFn: (list: string[], item: IClient) =>
          list.some((email) => item.email.indexOf(email) !== -1),
      },
      {
        name: 'Acciones',
        nzWidth: '120px',
        listOfFilter: [],
        filterFn: null,
      },
    ];
  }

  documentTypeFilt(): void {
    this.formControlDocumentNumber.setValue([]);
    this.formControlNames.setValue([]);
    this.formControlSurnames.setValue([]);
    const clients = this._clientsSvc.filter(
      'documentType',
      this.formControlDocumentType.value
    );
    console.log({ clients });
    this.clientsView = clients;
  }

  documentNumberFilt(): void {
    this.formControlDocumentType.setValue([]);
    this.formControlNames.setValue([]);
    this.formControlSurnames.setValue([]);
    this.clientsView = [];
    this.formControlDocumentNumber.value.length > 0
      ? this.clients.forEach((client) => {
          this.formControlDocumentNumber.value.forEach(
            (documentNumberItem: { documentNumber: string }) => {
              if (client.documentNumber === documentNumberItem.documentNumber) {
                this.clientsView.push(client);
              }
            }
          );
        })
      : (this.clientsView = this.clients);
  }

  namesFilt(): void {
    this.formControlDocumentType.setValue([]);
    this.formControlDocumentNumber.setValue([]);
    this.formControlSurnames.setValue([]);
    this.clientsView = [];
    this.formControlNames.value.length > 0
      ? this.clients.forEach((client) => {
          this.formControlNames.value.forEach((nameItem: { names: string }) => {
            if (client.names === nameItem.names) {
              this.clientsView.push(client);
            }
          });
        })
      : (this.clientsView = this.clients);
  }

  surnamesFilt(): void {
    this.formControlDocumentType.setValue([]);
    this.formControlDocumentNumber.setValue([]);
    this.formControlNames.setValue([]);
    this.clientsView = [];
    this.formControlSurnames
      ? this.clients.forEach((client) => {
          this.formControlSurnames.value.forEach(
            (surnameItem: { surnames: string }) => {
              if (client.surnames === surnameItem.surnames) {
                this.clientsView.push(client);
              }
            }
          );
        })
      : (this.clientsView = this.clients);
  }

  restFiltFormValues(list: Array<any>): void {
    if (list.length === 0) {
      this.clientsView = this.clients;
    }
  }

  showEditModal(client: IClient, i: number): void {
    this._modalSvc.info({
      nzTitle: 'Editar Cliente',
      nzContent: ClientRegisterComponent,
      nzWidth: '90%',
      nzIconType: 'edit',
      nzOnOk: () => this.getClients(),
      nzOnCancel: () => this.getClients(),
    });
    this._clientsSvc._storageSvc.set(
      localStorageLabels.client,
      JSON.stringify(client)
    );
  }

  clientDelete(client: IClient): void {
    this._clientsSvc._storageSvc.set(localStorageLabels.spinning, 'true');
    if (client.id) {
      this._clientsSvc
        .deleteClient(client.id)
        .then((res) => {
          this.getClients();
          this.clientPerDelete = null;
          this._clientsSvc._storageSvc.set(
            localStorageLabels.spinning,
            'false'
          );
          this._message.success('El cliente fue eliminado correctamente');
        })
        .catch((error) => {
          this._clientsSvc._storageSvc.set(
            localStorageLabels.spinning,
            'false'
          );
          this._message.error(
            'Hubo un problema interno y no fue posible eliminar el cliente, por favor vuelva a intentarlo'
          );
        });
    }
  }
}
