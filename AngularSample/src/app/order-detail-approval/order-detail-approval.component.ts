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
} from "./order-detail-approval-interface";
import { OrderDetailApprovalService } from "./order-detail-approval-service";
import { ActivatedRoute } from "@angular/router";
import { CommonService } from "app/common/common.service";
import { AppComponent } from '../app.component'
import { Const } from '../common/const'

@Component({
  selector: "app-order-detail-approval",
  templateUrl: "./order-detail-approval.component.html",
  styleUrls: ["./order-detail-approval.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class OrderDetailApprovalComponent implements OnInit {
  pageTitle = "発注明細入力＿承認処理";

  datas: OrderDetail[];
  inputment: OrderSearchInputment;

  _url: string = "assets/data/dataApproval.json";

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private orderDetailService: OrderDetailApprovalService,
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
    this.inputment.startFromName = true;
    this.inputment.includeProName = false;
    this.inputment.detailCreated = false;
    this.inputment.detailNone = false;
    this.inputment.approval_1 = false;
    this.inputment.approval_2 = false;
  }

  getSearchRequest() {
    setTimeout(() => {
      this.orderService
        .getMultipileData(this._url)
        .subscribe((data) => (this.datas = data));
    });

    setTimeout(() => {
      let pageInput = document.getElementById("pageIndex");
      pageInput.setAttribute("value", "1");
      pageInput.removeAttribute("disabled");
    });
  }

  getOrderDetail($event, data) {
    var wTbody = $event.target.parentElement.parentElement;
    var rowIndex = wTbody.rowIndex;

    alert(data.contractNum);
  }
}
