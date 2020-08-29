import { Component, OnInit, OnDestroy, EventEmitter, Input, Output,ElementRef  } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { OrderDetailAddInputService } from './order-detail-add-input.service';
import { OrderDetailAddInputType } from './orderDetailAddInputType'
import { OrderJournalSelectComponent } from '../order-journal-select/order-journal-select.component';
import { OrderJournalSelectService } from '../order-journal-select/order-journal-select.service';
import { OrderJournalSelectType } from '../order-journal-select/orderJournalSelectType';
import { Subscription } from 'rxjs';
import { OrderSupplierSelectComponent } from '../order-supplier-select/order-supplier-select.component';
import { OrderSupplierSelectService } from '../order-supplier-select/order-supplier-select.service';
import { OrderSupplierSelectType } from '../order-supplier-select/orderSupplierSelectType';
import { runInThisContext } from 'vm';
import { Location } from '@angular/common';
import { AppComponent } from '../app.component'
import { Const } from '../common/const'


@Component({
    selector: 'order-detail-add-input',
    templateUrl: './order-detail-add-input.component.html',
    styleUrls: ['../common/common.component.css',
                './order-detail-add-input.component.css']
})

export class OrderDetailAddInputComponent implements OnInit {

  title = '発注明細入力_明細入力';

  _element: HTMLElement;
  path:any;

  journalCode:String="";
  accountingCategory:String="";
  orderJournalName:String="";
  supplierCode:String="";
  supplierJournalName:String="";

  //TODO
  datas: OrderDetailAddInputType[];
  resVal:OrderDetailAddInputType;

    /**
   * コンストラクタ
   *
   * @param {ModalService} modalService
   * @memberof ModalComponent
   */
  constructor(
    private appComponent: AppComponent,
    private orderDetailAddInputService: OrderDetailAddInputService,
    private orderJournalSelectService: OrderJournalSelectService,
    private orderSupplierSelectService: OrderSupplierSelectService,
    private element: ElementRef,
    private router: Router,
    private _location: Location,
  ) { this._element = this.element.nativeElement }

  ngOnInit() {
        this.appComponent.setHeader(Const.ScreenName.S0004,Const.LinKSetting.L0004);
        this.journalCode = this.orderJournalSelectService.getVal().journalCode;
        this.accountingCategory = this.orderJournalSelectService.getVal().accountingCategory;
        this.orderJournalName = this.orderJournalSelectService.getVal().orderJournalName;
        this.supplierCode = this.orderSupplierSelectService.getVal().supplierCode;
        this.supplierJournalName = this.orderSupplierSelectService.getVal().supplierJournalName;
      }

  public onBackClick($event) {
    this._location.back();
  }

  public onClick($event) {
    this.orderDetailAddInputService.setVal(this.resVal);
    this.path = this._location.back();
    this._location.go(this.path);
  }

}

