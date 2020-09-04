import { SplitOrderDetailShiwake } from '../../entities/odis0060.entity';
import { Component, OnInit, ViewChild, Input, OnChanges, ViewEncapsulation } from '@angular/core';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { CommonComponent } from 'app/common/common.component';
import { CommonService } from 'app/common/common.service';
import { SplitOrderDetailInputComponent } from '../../component/split-detail-input.component'

@Component({
  selector: 'split-shiwake-table',
  styleUrls: ['table-shiwake.css'],
  templateUrl: './table-shiwake.html',
  encapsulation: ViewEncapsulation.None,
})

export class SplitOrderDetailShiwakeTable {

  @Input() shiwakeData: SplitOrderDetailShiwake[];

  shiwakeColumns: string[] = [
    'journalCode',
    'accountCode',
    'journalName',
    'orderSupplierCode',
    'orderSupplierName',
    'orderPlanAmount',
  ];

  dataSource: any;
}
