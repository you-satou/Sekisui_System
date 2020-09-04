import {
  Component,
  OnInit,
  ChangeDetectorRef,
  NgModule,
  ViewEncapsulation,
  ViewChild,
} from "@angular/core";
import {
  OrderDetail,
  OrderSearchInputment,
} from "../entities/odis0010.entity";
import { CommonService } from "app/common/common.service";
import { AppComponent } from '../../app.component'
import { Const } from '../../common/const'

interface RadioButton{
  startFromName: boolean;
}

@Component({
  selector: "app-order-detail-approval",
  templateUrl: "./order-detail-approval.component.html",
  styleUrls: ["./order-detail-approval.component.css"],
  encapsulation: ViewEncapsulation.None,
})



export class OrderDetailApprovalComponent implements OnInit {
  pageTitle = "発注明細入力＿承認処理";

  orderDetailData: OrderDetail[];
  inputment: OrderSearchInputment;
  
  checked: RadioButton = {
    startFromName: true,
  };

  _url: string = "assets/data/dataApproval.json";
  _urlSearchName: string = "OrderDetailApproval/Search";
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private appComponent: AppComponent,
    private orderService: CommonService
  ) {}

  displayedColumns: string[] = [
    "contractNum",
    "propertyName",
    "planOrderAmount",
    "approvalRequestAmount",
    "performanceOrderAmount",
    "receivedAmount",
    "progressRate",
    "createdDetail",
    "approval_1",
    "approval_2",
  ];

  ngOnInit() {
    // ヘッダー 設定
    this.appComponent.setHeader(Const.ScreenName.S0001, Const.LinKSetting.L0000)
    this.setStartPage();
  }

  setStartPage() {
    this.inputment = new OrderSearchInputment();
    this.inputment.detailCreated = false;
    this.inputment.detailNone = false;
    this.inputment.approval_1 = false;
    this.inputment.approval_2 = false;
  }

  getSearchRequest() {

    if(this.checkInput(this.inputment)){

      setTimeout(()=> {
        this.orderService.getSearchRequest(Const.UrlLinkName.S0001_Search,this.inputment)
        .then(
          (response) => {
            this.orderDetailData = response;
            if(this.orderDetailData != null){
              let pageInput = document.getElementById("pageIndex");
              pageInput.setAttribute("value", "1");
              pageInput.removeAttribute("disabled");
            }
          }
        );
      });

    }



  }

  checkInput(input: OrderSearchInputment):boolean{

    // if(this.checked.startFromName){
    //   input.searchByName = "1"
    // }

    input.searchByName = this.checked.startFromName === true? "1":"2";

    alert(input.searchByName);

    return false;
  }
  
}

