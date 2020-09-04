import { CommonService } from './common/common.service';
import { OrderDetailShiwakeTable } from './ODIS0020/component/table-shiwake/table-shiwake';
import { SplitOrderDetailService } from './ODIS0060/services/split-detail-input-service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RouteDetailComponent } from './route-detail/route-detail.component';
import { WkAllItemTypesService } from './wk-all-item-types.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrderDetailApprovalComponent } from './ODIS0010/component/order-detail-approval.component';
import { CommonComponent } from './common/common.component';

import { IndexComponent } from './ODIS0000/component/index.component';
import { OrderJournalSelectComponent } from './ODIS0030/component/order-journal-select.component';
import { SupplierPatternComponent } from './ODIS0050/component/supplier-pattern.component';
import { SplitOrderDetailInputComponent } from './ODIS0060/component/split-detail-input.component';
import { OrderDetailInputComponent } from './ODIS0020/component/order-detail-input.component';
import { OrderSupplierSelectComponent } from './ODIS0040/component/order-supplier-select.component';

// 発注明細入力＿承認処理テーブル
import { OrderDetailApprovalTable } from './ODIS0010/component/oder-detail-approval-table';
import { MatTableModule, MatTabsModule, MatButtonModule,MatButtonToggleModule, MatIconModule } from '@angular/material';
import { MatPaginatorModule,MatPaginatorIntl} from '@angular/material/paginator';
import { MatSortModule} from '@angular/material/sort';
import { OrderDetailPaginator } from './ODIS0010/component/order-detail-paginator';
import { SplitOrderDetailShiwakeTable } from './ODIS0060/component/table-shiwake/table-shiwake';
import { OrderApprovalPaginator } from './ODIS0010/component/order-paginator.directive';


const appRoute: Routes = [
  { path: '', component: IndexComponent },
  { path: '3', component: RouteDetailComponent },
  { path: 'OrderDetailApproval', component: OrderDetailApprovalComponent },
  { path: 'OrderJournalSelect', component: OrderJournalSelectComponent },
  { path: 'SupplierPattern', component: SupplierPatternComponent},
  { path: 'SplitDetailInput', component: SplitOrderDetailInputComponent},
  { path: 'OrderDetailInput', component: OrderDetailInputComponent},
  { path: 'OrderSupplierSelect', component: OrderSupplierSelectComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    RouteDetailComponent,
    OrderDetailApprovalComponent,
    IndexComponent,
    OrderJournalSelectComponent,
    SupplierPatternComponent,
    SplitOrderDetailInputComponent,
    OrderDetailInputComponent,
    OrderSupplierSelectComponent,

    // 発注明細入力＿承認処理テーブル
    OrderDetailApprovalTable,
    OrderDetailShiwakeTable,
    SplitOrderDetailShiwakeTable,
    OrderApprovalPaginator

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    RouterModule.forRoot(appRoute),

    // 発注明細入力＿承認処理テーブル
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTabsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatIconModule
  ],
  providers: [WkAllItemTypesService,
              SplitOrderDetailService,
              // Order Services
              CommonService,
              CommonComponent,
              SplitOrderDetailShiwakeTable,
              {provide:MatPaginatorIntl, useValue:OrderDetailPaginator()}
              ],
  bootstrap: [AppComponent]
})
export class AppModule { }
