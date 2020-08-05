import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
// import { IndexItemType } from '../IndexItemType';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['../common/common.component.css',
              './index.component.css']
})

export class IndexComponent implements OnInit {
    
    _element: HTMLElement;

    // indexDataList: IndexItemType[]

    pageIndex: number = 0;
    recordMax: number = 0;
    pageMax: number = 0;
    pageSize: number = 50;

    constructor(
        private wkAllItemTypesService: WkAllItemTypesService,
        private changeDetectorRef: ChangeDetectorRef,
        private element: ElementRef,
        private router: Router
      ) { this._element = this.element.nativeElement }

    ngOnInit() {
        // // データ取得
        // this.wkAllItemTypesService.indexJson()
        // .subscribe(response => {
        //   let datas: IndexItemType[] = response;
        //   this.recordMax = datas.length;
        //   this.pageMax = Math.floor(this.recordMax / this.pageSize);
        //   this.indexDataList = response;
        // });
    }

}
