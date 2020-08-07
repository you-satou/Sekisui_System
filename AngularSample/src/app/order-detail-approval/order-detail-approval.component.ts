import { Component, OnInit} from '@angular/core';
import { OrderDetail,OrderSearchInputment } from './orderDetail';
import { testData} from './test-order-detail';
import { Router, ActivatedRoute,ParamMap} from '@angular/router';
import { lstatSync } from 'fs';


@Component({
  selector: 'app-order-detail-approval',
  templateUrl: './order-detail-approval.component.html',
  styleUrls: ['./order-detail-approval.component.css']
})
export class OrderDetailApprovalComponent implements OnInit {

  pageTitle = "発注明細入力＿承認処理";

  datas: OrderDetail [] = testData;

  inputment: OrderSearchInputment[];

  constructor( private router : ActivatedRoute) { }

  ngOnInit() { 

  }

  private goToInputmentPage(){



  }



}
// export interface Tile {
//   color: string;
//   cols: number;
//   rows: number;
//   text: string;
// }


// export class gridView{
//   gvTitle: Tile[]=[
//     {text: 'One', cols: 3, rows: 1, color: 'lightblue'},
//     {text: 'Two', cols: 1, rows: 2, color: 'lightgreen'},
//     {text: 'Three', cols: 1, rows: 1, color: 'lightpink'},
//     {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
//   ];
// }


// export class orderDetailGrid{
//   columns:any[]= [
//     {
//         display: '契約番号',
//         variable: 'contractNum',
//         filter: 'text',
//     },
//     {
//       display: '物件名',
//       variable: 'propertyName',
//       filter: 'text',
//   },
//   {
//     display: '発注予定金額',
//     variable: 'planOrderAmout',
//     filter: 'text',
// },
// {
//   display: '承認依頼金額合計',
//   variable: 'approvalRequestAmount',
//   filter: 'text',
// },
// {
//   display: '発注金額合計',
//   variable: 'performanceOrderAmount',
//   filter: 'text',
// },
// {
//   display: '受入金額合計',
//   variable: 'receivedAmount',
//   filter: 'text',
// },
// {
//   display: '進捗率',
//   variable: 'progessRate',
//   filter: 'text',
// },
// {
//   display: '明',
//   variable: 'createdDetail',
//   filter: 'text',
// },
// {
//   display: '承１',
//   variable: 'approval_1',
//   filter: 'text',
// },
// {
//   display: '承２',
//   variable: 'approval_2',
//   filter: 'text',
// }
//   ];

// sorting: any ={
//     column: '契約番号',
//     descending: false
// }

//   hdrbtns: any[] = [];
//   gridbtns: any[] = [];

//   initGridBtn(){

//     this.hdrbtns = [
//       {
//           title: 'Add',
//           keys: [''],
//           action: DBOperation.create,
//           ishide: this.isREADONLY

//       }];
//   this.gridbtns = [
//       {
//           title: 'Edit',
//           keys: ['Id'],
//           action: DBOperation.update,
//           ishide: this.isREADONLY
//       },
//       {
//           title: 'X',
//           keys: ["Id"],
//           action: DBOperation.delete,
//           ishide: this.isREADONLY
//       }
//   ];

//   }





