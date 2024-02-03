import { NzTableFilterFn, NzTableFilterList } from 'ng-zorro-antd/table';

export interface IColumnItem {
  name: string;
  // sortOrder: NzTableSortOrder | null;
  // sortFn: NzTableSortFn<DataItem> | null;
  listOfFilter: NzTableFilterList;
  filterFn: NzTableFilterFn<any> | null;
  filterMultiple: boolean;
  // sortDirections: NzTableSortOrder[];
}
