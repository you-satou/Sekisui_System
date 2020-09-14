import { Component, OnInit, ChangeDetectorRef,ViewEncapsulation } from "@angular/core";
import { OrderDetail, OrderSearchInputment } from "../entities/odis0010.entity";
import { CommonService } from "app/common/common.service";
import { AppComponent } from "../../app.component";
import { Const } from "../../common/const";

interface RadioButton {
  startFromName: boolean;
}

@Component({
  selector: "app-order-detail-approval",
  templateUrl: "./order-detail-approval.component.html",
  styleUrls: ["./order-detail-approval.component.css"],
  encapsulation: ViewEncapsulation.None,
})
export class OrderDetailApprovalComponent implements OnInit {

  orderDetailData: OrderDetail[];
  inputment= new OrderSearchInputment();

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
    this.appComponent.setHeader(
      Const.ScreenName.S0001,
      Const.LinKSetting.L0000
    );
    this.setStartPage();
  }

  setStartPage() {
    this.inputment.Clear();

  }

  getSearchRequest() {
    console.log(this.inputment);
    if (this.checkInput(this.inputment)) {
      // setTimeout(()=> {
      //   this.orderService.getSearchRequest(Const.UrlLinkName.S0001_Search,this.inputment)
      //   .then(
      //     (response) => {
      //       this.orderDetailData = response;
      //       if(this.orderDetailData != null){
      //         let pageInput = document.getElementById("pageIndex");
      //         pageInput.setAttribute("value", "1");
      //         pageInput.removeAttribute("disabled");
      //       }
      //     }
      //   );
      // });

      this.orderService.getMultipileData(this._url).subscribe((data) => {
        this.orderDetailData = data;
        if (this.orderDetailData != null) {
          let pageInput = document.getElementById("pageIndex");
          pageInput.setAttribute("value", "1");
          pageInput.removeAttribute("disabled");
        }
      });
    }
  }

  checkInput(input: OrderSearchInputment): boolean {
    return true;
  }
}
