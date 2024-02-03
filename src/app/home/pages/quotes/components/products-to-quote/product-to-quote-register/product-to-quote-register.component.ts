import { Component, OnDestroy, OnInit } from '@angular/core';
import { JsonPipe, NgClass } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GlobalHeaderComponent } from '../../../../../global-header/global-header.component';
import { ProductsToQuoteService } from '../products-to-quote.service';
import { RoutesApp } from '../../../../../../constants';
import { localStorageLabels } from '../../../../../../constants/localStorageLabels';
import { IGlobalHeaderData } from '../../../../../../../interfaces/global-header-data.interface';
import { IProductToQuote } from '../../../../../../../interfaces/productToQuote.interface';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { ITakenIntoAccount } from '../../../../../../../interfaces/takenIntoAccount.interface';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-product-to-quote-register',
  standalone: true,
  imports: [
    JsonPipe,
    GlobalHeaderComponent,
    ReactiveFormsModule,
    NgClass,
    NzGridModule,
    NzCardModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzSelectModule,
    NzMessageModule,
  ],
  templateUrl: './product-to-quote-register.component.html',
  styleUrl: './product-to-quote-register.component.css',
})
export class ProductToQuoteRegisterComponent implements OnInit, OnDestroy {
  public globalHeaderData: IGlobalHeaderData = {
    tittle: '',
    backTo: {
      label: 'Volver a cotizaciones',
      route: `${RoutesApp.home}/${RoutesApp.quotes}`,
    },
  };
  public productToQuote: IProductToQuote | null = null;
  public takenIntoAccountList: ITakenIntoAccount[] = [];

  public form: FormGroup = this._fb.group({
    name: [null, [Validators.required]],
    takenIntoAccount: [null, [Validators.required]],
  });

  constructor(
    private _productsToQuoteService: ProductsToQuoteService,
    private _message: NzMessageService,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getTakenIntoAccount();
    this.productToQuote = this.getProductToQuote();
    !this.productToQuote
      ? this.globalHeaderInit('Registrar producto para cotizar')
      : this.setValueForm(this.productToQuote);
  }

  getProductToQuote(): IProductToQuote | null {
    return JSON.parse(
      this._productsToQuoteService._storageSvc.get(
        localStorageLabels.productToQuote
      ) ?? 'null'
    );
  }

  setValueForm(productToQuote: IProductToQuote): void {
    this.form.setValue({
      name: productToQuote.name,
      takenIntoAccount: productToQuote.takenIntoAccount,
      // takenIntoAccount: productToQuote.takenIntoAccount.map(function (obj) {
      //   return obj.id;
      // }),
    });
  }

  getTakenIntoAccount(): void {
    this._productsToQuoteService.getTakenIntoAccount().subscribe(
      (takenIntoAccount) => {
        this.takenIntoAccountList = takenIntoAccount;
      },
      (error) => {
        console.log({ error });
      }
    );
  }

  globalHeaderInit(title: string): void {
    this.globalHeaderData.tittle = title;
  }

  submit(event: any): void {
    if (!this.form.valid) {
      this._message.error(
        'El formulario no es valido, por favor, rectifique la información'
      );
      return;
    }
    this.productToQuote && this.productToQuote.id
      ? this._productsToQuoteService
          .editProductToQuote(this.productToQuote.id, this.form.value)
          .then((productToQuoteEdited) => {
            this._message.success(
              'Producto para cotizar editado correctamente'
            );
          })
          .catch((error) => {
            console.log({ error });
            this._message.error(
              'Hubo un error por lo que no fue posible editar el producto para cotizar, por favor vuelva a intentarlo'
            );
          })
      : this._productsToQuoteService
          .registerProductToQuote(this.form.value)
          .then((productToQuoteRegister) => {
            this._message.success(
              'Producto para cotizar registrado correctamente'
            );
            this.form.reset();
          })
          .catch((error) => {
            console.log({ error });
            this._message.error(
              'Hubo un error por lo que no fue posible registrar el producto para cotizar, por favor vuelva a intentarlo'
            );
          });
  }

  ngOnDestroy(): void {
    this._productsToQuoteService._storageSvc.remove(
      localStorageLabels.productToQuote
    );
  }
}
