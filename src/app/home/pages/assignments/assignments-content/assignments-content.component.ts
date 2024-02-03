import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GlobalHeaderComponent } from '../../../global-header/global-header.component';
import { AssignmentRegisterComponent } from '../assignment-register/assignment-register.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { RoutesApp } from '../../../../constants';
import { AssignmentsService } from '../assignments.service';
import { IGlobalHeaderData } from '../../../../../interfaces/global-header-data.interface';
import { IAssignment } from '../../../../../interfaces/assignment.interface';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { localStorageLabels } from '../../../../constants/localStorageLabels';
import { NzAffixModule } from 'ng-zorro-antd/affix';

@Component({
  selector: 'app-assignments-content',
  standalone: true,
  imports: [
    NgIf,
    NgFor,
    DatePipe,
    RouterLink,
    GlobalHeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    NzGridModule,
    NzTableModule,
    NzSelectModule,
    NzDropDownModule,
    NzCheckboxModule,
    NzFormModule,
    NzInputModule,
    NzAlertModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzSpinModule,
    NzAffixModule,
  ],
  templateUrl: './assignments-content.component.html',
  styleUrl: './assignments-content.component.css',
})
export class AssignmentsContentComponent {
  public globalHeaderData: IGlobalHeaderData = {
    tittle: 'Asignaciones',
    backTo: { label: 'Volver a Home', route: RoutesApp.home },
  };

  public assignments: Array<IAssignment> = [];
  public assignmentsView: Array<IAssignment> = [];
  public searchValue = '';
  public visible = false;
  public allChecked = false;
  public indeterminate = true;
  public administratorsWhoAssignsListView: Array<{
    label: string;
    value: string;
    checked: boolean;
  }> = [];
  // public users: IUser[] = [];
  // public user: IUser | null = null;
  public users: any[] = [];
  public user: any | null = null;
  public assignmentPerDelete: IAssignment | null = null;

  public assignmentsFiltForm: FormGroup = this._fb.group({
    // the
  });

  public usersNames: Array<{ name: string }> = [];
  public whos: Array<string> = [];
  public employeesNames: Array<{ name: string }> = [];
  public theAssignments: Array<string> = [];

  public spinning: boolean = false;

  filterForm = this._fb.group({
    whoAssigns: [],
    responsibleForTheAssignment: [],
    theAssigned: [],
  });

  constructor(
    private _assignmentsSvc: AssignmentsService,
    private _modal: NzModalService,
    private _message: NzMessageService,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getAssignments();
    this._assignmentsSvc._storageSvc.remove(localStorageLabels.assignment);
  }

  getAssignments(): void {
    this.theAssignments = [];
    this.spinning = true;
    this._assignmentsSvc.getAssignments().subscribe(
      (assignments) => {
        this.assignments = assignments;
        this.assignmentsView = this.assignments;
        assignments.forEach((assignment) => {
          this.theAssignments.includes(assignment.theAssigned)
            ? false
            : this.theAssignments.push(assignment.theAssigned);
        });
        this.spinning = false;
      },
      (err) => {
        console.log({ error: err });
        this.spinning = false;
      }
    );
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    const dto = this.removeNullProperties(this.filterForm.value);
    const filt = this.assignments.filter((assignmentItem) => {
      return assignmentItem.theAssigned === dto.theAssigned;
    });
    this.assignmentsView = filt.length > 0 ? filt : this.assignments;
  }

  removeNullProperties(obj: any) {
    for (const key in obj) {
      if (
        obj[key] === null ||
        (Array.isArray(obj[key]) && obj[key].length === 0)
      ) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        this.removeNullProperties(obj[key]);
      }
    }
    return obj;
  }

  updateAllChecked(): void {
    this.indeterminate = false;
    if (this.allChecked) {
      this.administratorsWhoAssignsListView =
        this.administratorsWhoAssignsListView.map((item) => ({
          ...item,
          checked: true,
        }));
    } else {
      this.administratorsWhoAssignsListView =
        this.administratorsWhoAssignsListView.map((item) => ({
          ...item,
          checked: false,
        }));
    }
  }

  updateSingleChecked(): void {
    if (this.administratorsWhoAssignsListView.every((item) => !item.checked)) {
      this.allChecked = false;
      this.indeterminate = false;
    } else if (
      this.administratorsWhoAssignsListView.every((item) => item.checked)
    ) {
      this.allChecked = true;
      this.indeterminate = false;
    } else {
      this.indeterminate = true;
    }
  }

  showEditAssignment(assignment: IAssignment): void {
    this._modal.info({
      nzIconType: 'edit',
      nzContent: AssignmentRegisterComponent,
      nzWidth: '90%',
    });
    this._assignmentsSvc.set(
      localStorageLabels.assignment,
      JSON.stringify(assignment)
    );
  }

  assignmentDelete(assignment: IAssignment): void {
    if (assignment.id) {
      this._assignmentsSvc
        // .deleteassignment(assignmentId)
        .deleteAssignment(assignment.id)
        .then((assignmentPostDeleteResponse) => {
          // this.getAssignments();
          this.assignmentPerDelete = null;
          this._message.success('Assignación eliminada correctamente');
        })
        .catch((error) => {
          console.log({ error });
          this._message.error(
            'Hubo un problema interno, por favor vuelva a intentarlo'
          );
        });
    }
  }
}
