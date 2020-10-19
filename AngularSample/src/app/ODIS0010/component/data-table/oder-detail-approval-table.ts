import { EventEmitter } from '@angular/core';
import { Component, ViewChild, Input, Output, ViewEncapsulation, HostListener } from '@angular/core';
import { CommonComponent } from './../../../common/common.component';
import { MatPaginator} from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material';
import { Router} from '@angular/router';

import { ODIS0010OrderDetail } from '../../entities/odis0010.entity';

@Component({
  selector: 'order-detail-approval-table',
  styleUrls: ['./oder-detail-approval-table.css'],
  templateUrl: './oder-detail-approval-table.html',
  encapsulation: ViewEncapsulation.None,
})

export class OrderDetailApprovalTable{

  @Input() resultData: ODIS0010OrderDetail[];

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
      'approval_1',
      'approval_2',
    ];

  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort, {static: true}) sort: MatSort;                  //ソート
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;   //パージネタ

  constructor(
    private router: Router,
    private baseComm : CommonComponent,
  ) {}

  ngOnInit() {
    
    //初期化、テーブルのソートを非活性する
    this.dataSource.sort.disabled = true;
    if(this.dataSource.data != null && this.dataSource.data.length > 0){
      this.dataSource.sort.disabled = false;
    }

    // this.dataSource.paginator.pageIndex = 1;
  }

  ngOnChanges( ) {
    this.dataSource = new MatTableDataSource<ODIS0010OrderDetail>(this.resultData);
    if(this.dataSource.data.length > 0){
      //データがある場合, ソートを活性化する
      this.sort.disabled = false;
    }
    else{
      //データがない場合, ソートを非活性する
      this.sort.disabled = true;
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
    this.dataSource.paginator.firstPage();
  }
 
  /**　ページに移動する */
  switchToOrderInputPage(data: ODIS0010OrderDetail){

    //発注明細入力＿詳細入力画面に遷移する時、パラメータを設定する
    this.router.navigate(['OrderDetailInput'],{ queryParams: {prop: data.propertyManagerCd, cntrt: data.contractNum}});
    
  }

  // ngOnDestroy(): void {

  //   var page = this.dataSource.paginator.pageIndex;
  //   var sort = this.dataSource.sort.direction;
  //   // console.log(page);
  //   // console.log(sort);
  //   let tblObj: tableObj;
  //   tblObj.pageIndex =page;
  //   tblObj.sortDirection = sort;
  //   // this.sendEmitter.emit(tblObj);

  // }

  // @HostListener(){

  // }

  /**
   * ソートの矢印の表示を設定する。
   * @param val ０：非表示、１：表示
   */
  hideSortArrow(val:string){

    //ソート矢印のエレメントを取得する
    let sortArrow: any = document.querySelector('div.mat-sort-header-arrow');

    if(sortArrow != null){
      sortArrow.style.opacity = val;
    }
  }

  displayContractNum(data: ODIS0010OrderDetail){

    let customerNum = this.baseComm.setValue(data.customerNum);
    if(customerNum == ''){

      return '';
    }
    return `${customerNum.substring(0,9)}-${customerNum.substring(9,11)}`;
  }

}

export interface tableObj{

  sortDirection: string,

  pageIndex: number,
}

