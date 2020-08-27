import { Component, OnInit, OnDestroy, EventEmitter, Input, Output,ElementRef  } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { OrderJournalSelectComponent } from '../order-journal-select/order-journal-select.component';
import { OrderJournalSelectService } from '../order-journal-select/order-journal-select.service';
import { OrderJournalSelectType } from '../order-journal-select/orderJournalSelectType';
import { Subscription } from 'rxjs';
import { OrderSupplierSelectComponent } from '../order-supplier-select/order-supplier-select.component';
import { OrderSupplierSelectService } from '../order-supplier-select/order-supplier-select.service';
import { OrderSupplierSelectType } from '../order-supplier-select/orderSupplierSelectType';
import { runInThisContext } from 'vm';
import { CommonComponent } from '../common/common.component';


export class ModalComponent{

}

