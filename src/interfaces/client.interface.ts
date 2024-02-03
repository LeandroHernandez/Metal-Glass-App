import { NzTableFilterFn, NzTableFilterList } from 'ng-zorro-antd/table';
import { IColumnItem } from './nz-column-table.interface';
import { ITypeDocument } from './type-document.interface';

export interface IClient {
  id?: string;
  documentType?: ITypeDocument | any;
  documentNumber: string;
  names: string;
  surnames: string;
  phoneNumber: string;
  email: string;
  // shoppingHistory?: IPurchase[];
  // datingHistory?: IAppointment[];
  shoppingHistory?: any[];
  datingHistory?: any[];
  customerGrade?: number;
  Nit?: string;
  Contact?: string;
  Address?: string;
  City?: string;
}

export interface ICLientColumnItem {
  name: string;
  nzWidth?: string;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<IClient> | null;
}
