import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';
import { SupplierPatternService } from './supplier-pattern.service';

@Component({
    selector: 'supplier-pattern',
    templateUrl: './supplier-pattern.component.html',
    styleUrls: ['./supplier-pattern.component.css']
  })

  export class SupplierPatternComponent implements OnInit {
    
    constructor(
      private modalService: SupplierPatternService
    ){}

    ngOnInit() {}

    ngOnDestroy() {
      // モーダルダイアログが閉じたタイミングで出力される
      console.log('destroyed');
    }

    public onClick($event) {
      this.notifyCloseModal();
    }

    private notifyCloseModal() {
      this.modalService.requestCloseModal();
    }
  }