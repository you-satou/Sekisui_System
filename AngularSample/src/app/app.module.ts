import { DatePipe } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Components
import { AppComponent } from './app.component';
import { MaterialModules } from './mat-module.app.component';
import { CommonComponent } from './common/common.component';
import { CommonService } from './common/common.service';
import { IndexComponent } from './ODIS0000/component/index.component';
import { OrderJournalSelectComponent } from './ODIS0030/component/order-journal-select.component';
import { SupplierPatternComponent } from './ODIS0050/component/supplier-pattern.component';
import { SplitOrderDetailComponent } from './ODIS0060/component/split-detail-input.component';
import { OrderDetailInputComponent } from './ODIS0020/component/order-detail-input.component';
import { OrderSupplierSelectComponent } from './ODIS0040/component/order-supplier-select.component';
import { OrderDetailApprovalTable } from './ODIS0010/component/data-table/oder-detail-approval-table';
import { SplitOrderDetailTable } from './ODIS0060/component/data-table/split-detail-table';
import { OrderApprovalPaginator } from './ODIS0010/component/paginator/order-paginator.directive';
import { OrderSplitApprovalMasterComponent } from './ODIS0070/component/order-split-approval-master.component';
import { OrderDetailShiwakeTable } from './ODIS0020/component/data-table/order-detail-input-table';
import { OrderDetailApprovalComponent } from './ODIS0010/component/order-detail-approval.component';
import { LoadingSpinner } from './common/progressingSpinner/common.spinner';
import { OrderGrossProfitMarginComponent } from './ODIS0080/component/order-gross-profit-margin.component';
import { AppNavigator } from './common/navigationBar/navigator.component';

const appRoute: Routes = [
  // { path: '', component: IndexComponent },
  { path: '', component: OrderDetailApprovalComponent },
  { path: 'OrderJournalSelect', component: OrderJournalSelectComponent },
  { path: 'SupplierPattern', component: SupplierPatternComponent},
  { path: 'SplitDetailInput', component: SplitOrderDetailComponent},
  { path: 'OrderDetailInput', component: OrderDetailInputComponent},
  { path: 'OrderSupplierSelect', component: OrderSupplierSelectComponent},
  { path: 'OrderSplitApprovalMaster', component: OrderSplitApprovalMasterComponent},
  { path: 'OrderGrossProfitMargin', component: OrderGrossProfitMarginComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    OrderDetailApprovalComponent,
    IndexComponent,
    OrderJournalSelectComponent,
    SupplierPatternComponent,
    SplitOrderDetailComponent,
    OrderDetailInputComponent,
    OrderSupplierSelectComponent,
    OrderApprovalPaginator,
    OrderSplitApprovalMasterComponent,
    OrderDetailApprovalTable,
    OrderDetailShiwakeTable,
    SplitOrderDetailTable,
    LoadingSpinner,
    OrderGrossProfitMarginComponent,
    AppNavigator,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    RouterModule.forRoot(appRoute, {useHash:true}),
    MaterialModules,
  ],
  providers: [
              CommonService,
              CommonComponent,
              DatePipe,
              ],
  bootstrap: [AppComponent]
})
export class AppModule { }
