import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProductToQuoteRegisterComponent } from './product-to-quote-register/product-to-quote-register.component';
import { ProductsToQuoteService } from './products-to-quote.service';
import { IProductToQuote } from '../../../../../../interfaces/productToQuote.interface';
import { localStorageLabels } from '../../../../../constants/localStorageLabels';
import { RoutesApp } from '../../../../../constants';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-products-to-quote',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    NzGridModule,
    NzCardModule,
    NzResultModule,
    NzMessageModule,
    NzSpinModule,
    NzModalModule,
    NzFormModule,
    NzSelectModule,
    NzAlertModule,
    NzButtonModule,
    NzIconModule,
  ],
  // templateUrl: './products-to-quote.component.html',
  template: `
    <!-- <p>products-to-quote works!</p> -->
    <nz-card nzHoverable>
      <nz-spin [nzTip]="'Cargando...'" [nzSpinning]="spinning">
        @if (productsToQuote.length > 0) {
        <div
          nz-row
          [nzGutter]="[24, 24]"
          nzAlign="middle"
          nzJustify="space-evenly"
        >
          <div nz-col [nzSpan]="24">
            <form [formGroup]="filterForm" nz-form>
              <nz-form-item>
                <nz-form-label [nzSpan]="24"
                  >Nombres de productos</nz-form-label
                >
                <nz-select
                  formControlName="productNames"
                  nzPlaceHolder="Campos tomados en cuenta"
                  nzMode="multiple"
                  (ngModelChange)="filterAction($event)"
                >
                  @for(productToQuote of productsToQuote; track $index) {
                  <nz-option
                    [nzValue]="productToQuote"
                    [nzLabel]="productToQuote.name"
                  ></nz-option>
                  }
                </nz-select>
              </nz-form-item>
            </form>
          </div>
          <div nz-col [nzSpan]="24">
            <div
              nz-row
              [nzGutter]="[24, 24]"
              nzAlign="middle"
              nzJustify="space-evenly"
              class="porductsToQuoteListContainer"
            >
              @for(productToQuote of productsToQuoteView; track $index) {
              <div
                nz-col
                [nzSpan]="5"
                [nzXXl]="5"
                [nzXl]="5"
                [nzLg]="5"
                [nzMd]="11"
                [nzSm]="22"
                [nzXs]="22"
                class="porductsToQuoteListContainerItem"
              >
                <nz-card
                  nzHoverable
                  [nzActions]="[EditSectionAction, DeleteSectionAction]"
                >
                  <h4>
                    <b>{{ productToQuote.name }}</b>
                  </h4>
                </nz-card>
                <ng-template #EditSectionAction>
                  <span
                    nz-icon
                    nzType="edit"
                    nzTheme="outline"
                    (click)="register(productToQuote)"
                  ></span>
                </ng-template>
                <ng-template #DeleteSectionAction>
                  <span
                    nz-icon
                    nzType="delete"
                    nzTheme="outline"
                    (click)="productToQuotePerDelete = productToQuote"
                  ></span>
                </ng-template>
              </div>
              }
            </div>
          </div>
          @if (productToQuotePerDelete) {
          <div nz-col [nzSpan]="24">
            <nz-alert
              nzShowIcon
              nzType="warning"
              nzMessage="¿Seguro?"
              [nzDescription]="teleteTemplate"
            ></nz-alert>
            <ng-template #teleteTemplate>
              <!-- <p>Info Description Info Description Info Description Info Description</p> -->
              <p>Seguro de eliminar a {{ productToQuotePerDelete.name }}</p>
              <div
                nz-row
                nzAlign="middle"
                [nzGutter]="[24, 24]"
                nzJustify="end"
              >
                <div nz-col>
                  <button
                    nz-button
                    nzType="primary"
                    nzDanger
                    (click)="delete(productToQuotePerDelete.id ?? '')"
                  >
                    Eliminar
                  </button>
                </div>
                <div nz-col>
                  <button
                    nz-button
                    nzType="primary"
                    (click)="productToQuotePerDelete = null"
                  >
                    Mejor no
                  </button>
                </div>
              </div>
            </ng-template>
          </div>
          }
          <div nz-col [nzSpan]="24">
            <div nz-row nzAlign="bottom" [nzGutter]="24" nzJustify="end">
              <div nz-col>
                <button
                  type="button"
                  nz-button
                  nzType="primary"
                  (click)="register()"
                >
                  Registrar producto para cotizar
                </button>
              </div>
            </div>
          </div>
        </div>
        } @else { @if(!spinning) {
        <nz-result
          nzStatus="success"
          [nzTitle]="
            'Para visualizar los productos disponibles para cotizar, registre uno'
          "
        >
          <div nz-result-extra>
            <button
              nz-button
              type="button"
              nzType="primary"
              nzShape="round"
              nzSize="large"
              (click)="register()"
            >
              Ir a registrar
            </button>
          </div>
        </nz-result>
        } }
      </nz-spin>
    </nz-card>
  `,
  // styleUrl: './products-to-quote.component.css',
  styles: [
    `
      h4 {
        text-align: center;
        margin: 0;
      }

      nz-select {
        width: 100%;
      }

      .porductsToQuoteListContainer {
        max-height: 150px;
        overflow: auto;
      }

      .porductsToQuoteListContainerItem {
        display: inline-block;
      }
    `,
  ],
})
export class ProductsToQuoteComponent implements OnInit {
  public productsToQuote: IProductToQuote[] = [];
  public productsToQuoteView: IProductToQuote[] = [];
  public productToQuotePerDelete: IProductToQuote | null = null;
  public spinning: boolean = false;
  // public productsToQuote: any[] = [];

  public filterForm: FormGroup = this._fb.group({
    productNames: [null],
  });

  constructor(
    private _fb: FormBuilder,
    private _roter: Router,
    private _productsToQuoteService: ProductsToQuoteService,
    private _message: NzMessageService,
    private _modalSvc: NzModalService
  ) {}

  ngOnInit(): void {
    this._productsToQuoteService._storageSvc.remove(
      localStorageLabels.productToQuote
    );
    this.getProductsToQuote();
  }

  getProductsToQuote(): void {
    this.spinning = true;
    this._productsToQuoteService.getProductsToQuote().subscribe(
      (productsToQuote) => {
        this.productsToQuote = productsToQuote;
        this.productsToQuoteView = productsToQuote;
        this.spinning = false;
      },
      (error) => {
        console.log({ error });
        this._message.error(
          'Hubo un error interno por lo cual no fe posible cargar los productos para cotización, por favor vuelva a intentarlo'
        );
        this.spinning = false;
      }
    );
  }

  filterAction(event: IProductToQuote[]) {
    event.length > 0
      ? (this.productsToQuoteView = event)
      : (this.productsToQuoteView = this.productsToQuote);
  }

  register(productoToQuote?: IProductToQuote) {
    productoToQuote
      ? (this._productsToQuoteService._storageSvc.set(
          localStorageLabels.productToQuote,
          JSON.stringify(productoToQuote)
        ),
        this._modalSvc.info({
          nzTitle: `Editar a ${productoToQuote.name}`,
          nzIconType: 'edit',
          nzContent: ProductToQuoteRegisterComponent,
          nzWidth: '90%',
        }))
      : (this._productsToQuoteService._storageSvc.remove(
          localStorageLabels.productToQuote
        ),
        this._roter.navigate([
          `${RoutesApp.home}/${RoutesApp.quotes}/${RoutesApp.productToQuoteRegister}`,
        ]));
  }

  delete(productToQuoteId: string) {
    this._productsToQuoteService
      .deleteProductToQuote(productToQuoteId)
      .then((productToQuoteDeltedResponse) => {
        this.productToQuotePerDelete = null;
        this._message.success(
          `El producto para cotizar fue eliminado correctamente`
        );
      })
      .catch((error) => {
        console.log({ error });
        this._message.error(
          `Hubo un problema por lo que no fue posible eliminar el producto para cotizar, por favor vuelva a intentarlo`
        );
      });
  }
}
