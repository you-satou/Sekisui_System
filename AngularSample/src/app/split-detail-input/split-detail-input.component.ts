import { SplitOrderDetailShiwake, SplitOrderDetailSplit, SplitOrderDetailInput} from './split-detail-input-interface';
import { SplitOrderDetailService } from './split-detail-input-service';
import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ElementRef, ɵɵresolveBody, ViewEncapsulation, Input } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { title } from 'process';
import { AddOrderDetailComponent } from 'app/add-order-detail/add-order-detail.component';
import { AddSupplierPatternService } from 'app/add-order-detail/add-supplier-pattern.service';
import { SplitOrderDetailShiwakeTable } from './table-shiwake/table-shiwake';
import { Subscription } from 'rxjs';

@Component({
    selector: 'order-detail-input',
    templateUrl: './split-detail-input.component.html',
    styleUrls: ['./split-detail-input.component.css'],
    encapsulation: ViewEncapsulation.None
  })

  export class SplitOrderDetailInputComponent implements OnInit, OnDestroy {
    
    _element: HTMLElement;

    private subscription: Subscription;

    public modal: any = null;
    
    orderPlanAmount:String="test";
    comment:String="";
    requestDate:String="";
    requester:String="";

    title = '発注明細入力＿分割明細入力';
    
    shiwakeData:SplitOrderDetailShiwake[];

    bunkatsuData: SplitOrderDetailSplit[];

    orderInputDatas : SplitOrderDetailInput[];

    resVal: SplitOrderDetailShiwake;

    testich: String="";

    constructor(
      private service: SplitOrderDetailService,
      private modalService: AddSupplierPatternService,
      private element: ElementRef,
      public newRowTest: SplitOrderDetailShiwakeTable,
    ){
      this._element = this.element.nativeElement
    }

    ngOnInit() {

      this.getSplitOrderInputData();
      this.getSplitOderDetailShiwake();
      this.getSplitOrderDetailSplit()

      this.subscription = this.modalService.closeEventObservable$.subscribe(
        () => {
          // プロパティ modal に null をセットすることでコンポーネントを破棄する
          // このタイミングで ModalComponent では ngOnDestroy が走る
          
          this.modal = null;
          // データ設定
          this.orderPlanAmount = this.modalService.getVal().orderPlanAmount
          this.comment = this.modalService.getVal().comment
          this.requestDate = this.modalService.getVal().requestDate
          this.requester = this.modalService.getVal().requester
        }
      );

    }

    /**
   * 終了処理
   *
   * @memberof AppComponent
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * クリックイベント
   *
   * @param {*} $event イベント情報
   * @memberof AppComponent
   */

  public onClick($event, orderPlanAmountTest) {
    this.testich = orderPlanAmountTest
    this.modal = AddOrderDetailComponent;
  }

    getSplitOderDetailShiwake(){

      this.service.getSplitOderDetailShiwake()
      .subscribe(
        data => this.shiwakeData = data
      );
      

    }

    getSplitOrderInputData(){
      this.service.getSplitOrderInputData()
      .subscribe(
        data => this.orderInputDatas = data
      );
    }

    getSplitOrderDetailSplit(){
      this.service.getSplitOrderDetailSplit()
      .subscribe(
        data => this.bunkatsuData = data
      );
    }

    testChangeLabel(value:String){
      this.testich = value;
    }

    public onClickNewRow($event){
      this.newRowTest.addNewRow();
    }
  }