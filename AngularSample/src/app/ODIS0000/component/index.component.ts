import { Component, OnInit, ElementRef } from '@angular/core';
import { OrderJournalSelectService } from '../../ODIS0030/services/order-journal-select.service';
import { IndexService } from '../services/index.service'
import { AppComponent } from '../../app.component'
import { Const } from '../../common/const'
//import { countReset } from 'console';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['../../common/common.component.css',
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
      private modalService: OrderJournalSelectService,
      private element: ElementRef,
      private appComponent: AppComponent,
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
