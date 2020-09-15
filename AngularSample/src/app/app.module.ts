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
import { MaterialModules } from './mat-module.app.componet';
import { CommonComponent } from './common/common.component';
import { CommonService } from './common/common.service';
import { IndexComponent } from './ODIS0000/component/index.component';
import { OrderJournalSelectComponent } from './ODIS0030/component/order-journal-select.component';
import { SupplierPatternComponent } from './ODIS0050/component/supplier-pattern.component';
import { SplitOrderDetailInputComponent } from './ODIS0060/component/split-detail-input.component';
import { OrderDetailInputComponent } from './ODIS0020/component/order-detail-input.component';
import { OrderSupplierSelectComponent } from './ODIS0040/component/order-supplier-select.component';
import { OrderDetailApprovalTable } from './ODIS0010/component/approval-table/oder-detail-approval-table';
import { SplitOrderDetailShiwakeTable } from './ODIS0060/component/table-shiwake/table-shiwake';
import { OrderApprovalPaginator } from './ODIS0010/component/paginator/order-paginator.directive';
import { OrderSplitApprovalMasterComponent } from './ODIS0070/component/order-split-approval-master.component';
import { OrderSplitApprovalMasterService } from './ODIS0070/services/order-split-approval-master-service';
import { OrderDetailShiwakeTable } from './ODIS0020/component/table-shiwake/table-shiwake';
import { SplitOrderDetailService } from './ODIS0060/services/split-detail-input-service';
import { OrderDetailApprovalComponent } from './ODIS0010/component/order-detail-approval.component';

const appRoute: Routes = [
  { path: '', component: IndexComponent },
  { path: 'OrderDetailApproval', component: OrderDetailApprovalComponent },
  { path: 'OrderJournalSelect', component: OrderJournalSelectComponent },
  { path: 'SupplierPattern', component: SupplierPatternComponent},
  { path: 'SplitDetailInput', component: SplitOrderDetailInputComponent},
  { path: 'OrderDetailInput', component: OrderDetailInputComponent},
  { path: 'OrderSupplierSelect', component: OrderSupplierSelectComponent},
  { path: 'OrderSplitApprovalMaster', component: OrderSplitApprovalMasterComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    OrderDetailApprovalComponent,
    IndexComponent,
    OrderJournalSelectComponent,
    SupplierPatternComponent,
    SplitOrderDetailInputComponent,
    OrderDetailInputComponent,
    OrderSupplierSelectComponent,
    OrderDetailApprovalTable,
    OrderDetailShiwakeTable,
    SplitOrderDetailShiwakeTable,
    OrderApprovalPaginator,
    OrderSplitApprovalMasterComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    RouterModule.forRoot(appRoute),
    MaterialModules,
  ],
  providers: [
              SplitOrderDetailService,
              CommonService,
              CommonComponent,
              SplitOrderDetailShiwakeTable,
              OrderSplitApprovalMasterService,
              DatePipe,
              ],
  bootstrap: [AppComponent]
})
export class AppModule { }
