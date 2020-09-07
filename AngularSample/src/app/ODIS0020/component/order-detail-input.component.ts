import { OrderDetailInputGeneral,OrderDetailInput, OrderInfo, OrderDetailShiwake, OrderDetailSplit } from '../entities/odis0020.entity';
import { Component, OnInit, ViewEncapsulation, Input, OnChanges, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../common/common.service';
import { Subscription } from 'rxjs';
import { SupplierPatternService } from '../../ODIS0050/services/supplier-pattern.service';
import { SupplierPatternComponent } from '../../ODIS0050/component/supplier-pattern.component';

@Component({
    selector: 'order-detail-input',
    templateUrl: './order-detail-input.component.html',
    styleUrls: ['./order-detail-input.component.css'],
    encapsulation: ViewEncapsulation.None
  })

  export class OrderDetailInputComponent implements OnInit {

    @Input() contracNum: string;
    
    title = '発注明細入力＿詳細入力';

    orderGeneral: OrderDetailInputGeneral;

    sekkeiData: OrderDetailShiwake[];
    hontaiData: OrderDetailShiwake[];
    tsuikaData: OrderDetailShiwake[];

    bunkatsuData: OrderDetailSplit[];

    orderInputDatas : OrderDetailInput[];

    datas: any[];

    TBL1: OrderInfo[];
    TBL2: OrderInfo[];

    // url
    _urlShiwake: string = "assets/data/dataShiwake.json";
    _urlSplit: string = "assets/data/dataSplit.json";
    _urlOrderInput: string = "assets/data/dataOrderInput.json";
    _urlOrderTBL1: string = "assets/data/dataInputTBL1.json";
    _urlOrderTBL2: string = "assets/data/dataInputTBL2.json";

    journalCode:String="";
    accountingCategory:String="";
    orderJournalName:String="";
    supplierCode:String="";
    supplierJournalName:String="";

      // モーダルダイアログが閉じた際のイベントをキャッチするための subscription
    private subscription: Subscription;
  　// ngComponentOutlet にセットするためのプロパティ
    public modal: any = null;

    ngOnInit() {

      this.getOrderInputData();
      this.subscription = this.modalService.closeEventObservable$.subscribe(
        () => {
          // プロパティ modal に null をセットすることでコンポーネントを破棄する
          // このタイミングで ModalComponent では ngOnDestroy が走る
          
          this.modal = null;
        }
      );
    }

    constructor(
      private orderService: CommonService,
      public router: Router,
      private modalService: SupplierPatternService,
    ){ }
    
    getOrderInputData(){

      this.orderService.getSingleData(this._urlOrderInput)
      .subscribe(
        data => {if(data !== undefined){
          this.orderGeneral = data;
          this.orderInputDatas = this.orderGeneral.orderDetail;
          this.TBL1 = this.orderGeneral.orderInfoTable_1;
          this.TBL2 = this.orderGeneral.orderInfoTable_2;
          this.sekkeiData = this.orderGeneral.orderShiwakeTable;
          this.hontaiData = OrderDetailShiwake[0];
          this.tsuikaData = OrderDetailShiwake[0];
          this.bunkatsuData = this.orderGeneral.orderSliptTable;

        }});
    }

    swichPage(order: string){

      switch (order) {
        case 'meisai':
          this.router.navigate(['/OrderDetailAddInput']);
          break;
      
        case 'supplier':
          this.router.navigate(['./SupplierPattern']);
          break;
      }

    }

    orderJournalSelect(){
      this.modal = SupplierPatternComponent;
    }

  }