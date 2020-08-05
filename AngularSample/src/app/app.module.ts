import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { SearchFrameComponent } from './search-frame/search-frame.component';
import { SearchFrameComponent2 } from './search-frame2/search-frame2.component';
import { RouteDetailComponent } from './route-detail/route-detail.component';
import { WkAllItemTypesService } from './wk-all-item-types.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrderDetailApprovalComponent } from './order-detail-approval/order-detail-approval.component';


const appRoute: Routes = [
  { path: "", component: OrderDetailApprovalComponent },
  { path: "1", component: SearchFrameComponent },
  { path: "2", component: SearchFrameComponent2 },
  { path: "3", component: RouteDetailComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SearchFrameComponent,
    SearchFrameComponent2,
    RouteDetailComponent,
    OrderDetailApprovalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgbModule,
    FormsModule,
    RouterModule.forRoot(appRoute)
  ],
  providers: [WkAllItemTypesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
