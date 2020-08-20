import {Component, OnInit, ViewChild, Input, OnChanges} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource,MatTableModule} from '@angular/material/table';
import {MatSort} from '@angular/material';
import {OrderDetailShiwake} from '.../order-detail-input/order-detail-input-interface';

@Component({
  selector: 'shiwake-table',
  styleUrls: ['table-shiwake.css'],
  templateUrl: './table-shiwake.html',
})

export class OrderDetailShiwakeTable implements OnChanges {

   @Input() shiwakeData: any[];

  displayedColumns: string[] = [
      'journalCode',
      'accountCode', 
      'journalName',
      'orderSupplier', 
      'orderPlanAmount',
    ];

    dataSource :any;
  
//   @ViewChild(MatSort, {static: true})  sort:MatSort;


//   @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

// //   datas:OrderDetail[]

  constructor(){}

  ngOnChanges(
  ) {

    // this.dataSource = new MatTableDataSource<OrderDetail>(this.resultData);
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;
  }

  getOrderDetail($event, data){

    var wTbody = $event.target.parentElement.parentElement;
    var rowIndex = wTbody.rowIndex;

  }

}
