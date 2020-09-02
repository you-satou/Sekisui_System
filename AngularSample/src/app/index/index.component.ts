import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { Router,ActivatedRoute } from '@angular/router';
import { OrderJournalSelectComponent } from '../order-journal-select/order-journal-select.component';
import { OrderJournalSelectService } from '../order-journal-select/order-journal-select.service';
import { SupplierPatternComponent } from '../supplier-pattern/supplier-pattern.component';
import { SupplierPatternService } from '../supplier-pattern/supplier-pattern.service';
import { OrderSupplierSelectComponent } from '../order-supplier-select/order-supplier-select.component';
import { OrderSupplierSelectService } from '../order-supplier-select/order-supplier-select.service';
import { OrderDetailAddInputComponent } from '../order-detail-add-input/order-detail-add-input.component';
import { OrderDetailAddInputService } from '../order-detail-add-input/order-detail-add-input.service';
import { AddOrderDetailComponent } from 'app/add-order-detail/add-order-detail.component';
import { AddSupplierPatternService } from 'app/add-order-detail/add-supplier-pattern.service';
import {map} from 'rxjs/operators';
import { IndexService } from './index.service'

import { Subscription,Observable } from 'rxjs';
import { AppComponent } from '../app.component'
import { Const } from '../common/const'
//import { countReset } from 'console';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['../common/common.component.css',
              './index.component.css']
})
  /**
   * コンストラクタ
   *
   * @param {ModalService} modalService
   * @memberof ModalComponent
   */
export class IndexComponent implements OnInit{
    
  _element: HTMLElement;

  pageIndex: number = 0;
  recordMax: number = 0;
  pageMax: number = 0;
  pageSize: number = 50;

  str:String="";
  journalCode:String="";
  accountingCategory:String="";
  orderJournalName:String="";
  supplierName:String="";

  orderJournalSelectPath:String= Const.UrlSetting.U0005.toString();
  supplierPatternPath:String= Const.UrlSetting.U0003.toString();
  orderSupplierSelectPath:String = Const.UrlSetting.U0006.toString();
  orderDetailAddInput:String = Const.UrlSetting.U0004.toString();
  addOrderDetail:String = Const.UrlSetting.U0008.toString();

  constructor(
      private wkAllItemTypesService: WkAllItemTypesService,
      private changeDetectorRef: ChangeDetectorRef,
      private modalService: OrderJournalSelectService,
      private modalService2: SupplierPatternService,
      private modalService3: OrderSupplierSelectService,
      private modalService4: OrderDetailAddInputService,
      private modalService5: AddSupplierPatternService,
      private element: ElementRef,
      private appComponent: AppComponent,
      private router: Router,
      private indexService: IndexService, 
  ) { this._element = this.element.nativeElement
  }

  ngOnInit() {

      // ヘッダー 設定
      this.appComponent.setHeader(Const.ScreenName.S0000);
      //this.appComponent.setfrmUrl(Const.UrlSetting.U0000.toString());
      this.str = this.modalService.getVal().orderJournalName;
      
  }

  public setfrmUrl(){

    this.indexService.setVal(Const.UrlSetting.U0000.toString());

  }

}
