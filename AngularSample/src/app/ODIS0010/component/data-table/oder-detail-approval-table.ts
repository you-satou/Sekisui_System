import { EventEmitter } from '@angular/core';
import { Component, ViewChild, Input, Output, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CommonComponent } from './../../../common/common.component';
import { AppComponent } from './../../../app.component';
import { Const } from './../../../common/const';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortHeader } from '@angular/material';
import { Router} from '@angular/router';
import { ODIS0010OrderDetail } from '../../entities/odis0010.entity';
import { TableStatus } from 'app/ODIS0010/entities/odis001.session.entity';

@Component({
  selector: 'order-detail-approval-table',
  styleUrls: ['./oder-detail-approval-table.css'],
  templateUrl: './oder-detail-approval-table.html',
  encapsulation: ViewEncapsulation.None,
})

export class OrderDetailApprovalTable{

  approvalUnit: number;

  @Input() resultData: ODIS0010OrderDetail[];
  //セッションから取得するページＮｏ
  @Input() pgIndex: number;

  @Output() sendEmitter = new EventEmitter<any>();
  
  /** デーベルカラム名の定義列 */
  displayedColumns: string[] = [
      'detail',
      'contractNum',
      'propertyName',
      'planOrderAmount',
      'approvalRequestAmount',
      'performanceOrderAmount',
      'receivedAmount',
      'progressRate',
      'createdDetail',
      'approval_last',
  ];

  dataSource = new MatTableDataSource<any>();

  sortButton: any;

  @ViewChild(MatSort, {static: true}) sort: MatSort;                  //ソート
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;   //パージネタ

  constructor(
    private router: Router,
    private baseComm : CommonComponent,
    private changeDetector: ChangeDetectorRef,
    private appComponent: AppComponent,
  ) {}

  ngOnInit() {
    
    this.approvalUnit = this.appComponent.approvalLevels;
    switch(this.approvalUnit){
      //承認人数が4人で設定する
      case Const.ApprovalLevel.FourLevels:
        this.displayedColumns.splice((this.displayedColumns.indexOf('createdDetail')+1),0,"approval_1","approval_2","approval_3");
        break;
      //承認人数が3人で設定する
      case Const.ApprovalLevel.ThreeLevels:
        this.displayedColumns.splice((this.displayedColumns.indexOf('createdDetail')+1),0,"approval_1","approval_2");
        break;
      //承認人数が2人で設定する
      case Const.ApprovalLevel.TwoLevels:
        this.displayedColumns.splice((this.displayedColumns.indexOf('createdDetail')+1),0,"approval_1");
        break;
    }

    //初期化、テーブルのソートを非活性する
    this.dataSource.sort.disabled = true;
    //セッションからデータがあれば、展開する。
    if(this.resultData != null && this.resultData.length > 0){
      this.dataSource.data = this.resultData;
      this.dataSource.sort.disabled = false;
      this.dataSource.paginator.pageIndex = this.pgIndex;
      
      //データを投入してから、ページャネタのページ切り替えメッゾドを呼びだす
      this.dataSource.paginator.page.next();

      //ソートボタンのタブインデックスを設定する
      this.sortButton = document.querySelector('button.mat-sort-header-button');
      this.sortButton.setAttribute('tabIndex', '12');
      this.sortButton.removeAttribute('disabled');
    }

  }

  ngOnChanges( ) {
    //ソートボタンのタブインデックスを設定する
    this.sortButton = document.querySelector('button.mat-sort-header-button');
    if(this.sortButton != null){
      this.sortButton.setAttribute('tabIndex', '12');
      this.sortButton.removeAttribute('disabled');
    }

    this.dataSource = new MatTableDataSource<ODIS0010OrderDetail>(this.resultData);
    if(this.dataSource.data.length > 0){
      //データがある場合, ソートを活性化する
      this.sort.disabled = false;
    }
    else{
      //データがない場合, ソートを非活性する
      this.sort.disabled = true;
      if(this.sortButton != null){
        this.sortButton.setAttribute('disabled', 'true');
      }
    }
    // ソートした状態が前の状態に戻らない,　降順ー昇順だけ
    this.sort.disableClear = true;
    //データが絞り込まれている状態を解除する
    this.sort.direction = '';
    //ソート矢印を初期表示する。
    this.hideSortArrow('0'); 
    //テーブルのソートとパジーネタを設定する
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;

    //明細一覧のデータが変わったら、ページネータのページインデックスを初期化する。
    this.dataSource.paginator.pageIndex = 0;

    //データを投入してから、ページャネタのページ切り替えメッゾドを呼びだす
    this.dataSource.paginator.page.next();
  }
 
  /**　ページに移動する */
  public switchToOrderInputPage(data: ODIS0010OrderDetail){

    //発注明細入力＿詳細入力画面に遷移する時、パラメータを設定する
    this.router.navigate([Const.UrlSetting.U0002],{ queryParams: {prop: data.propertyNo, cntrt: data.contractNum},skipLocationChange: false, replaceUrl: false});
    
  }

  /**ソートボタン、またはページ切り替えた時、イベントを発生して、親コンポネントに送る */
  public sortAndPageChangeEvent($event){
    //テーブルをエミットする前に、パジネーターのコンポネントを先にレンダーする
    this.changeDetector.detectChanges();

    //paginator.next()を呼ぶときにイベントが発生しないので、Emitterデータを送らないようにする。
    if($event == undefined){
      return false;
    }

    let tblObj = new TableStatus();
    //ページインデックスを取得する。
    tblObj.pgIndex = this.dataSource.paginator.pageIndex;

    //ソートしたデータを保持する。
    tblObj.sortedData = this.dataSource.sortData(this.dataSource.data,this.sort);
    this.sendEmitter.emit(tblObj);
  }

  /**
   * ソートの矢印の表示を設定する。
   * @param val ０：非表示、１：表示
   */
  private hideSortArrow(val:string){

    //ソート矢印のエレメントを取得する
    let sortArrow: any = document.querySelector('div.mat-sort-header-arrow');

    if(sortArrow != null){
      sortArrow.style.opacity = val;
    }
  }

  public displayContractNum(data: ODIS0010OrderDetail){

    let customerNum = this.baseComm.setValue(data.customerNum);
    if(customerNum == ''){

      return '';
    }
    return `${customerNum.substring(0,9)}-${customerNum.substring(9,11)}`;
  }

}


