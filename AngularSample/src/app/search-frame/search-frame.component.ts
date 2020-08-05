import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
import { WkAllItemType } from '../WkAllItemType';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search-frame',
  templateUrl: './search-frame.component.html',
  styleUrls: ['./search-frame.component.css']
})
export class SearchFrameComponent implements OnInit {

  _element: HTMLElement;

  firstDayOfWeek = 7;
  displayMonths = 1;
  navigation = 'select';
  showWeekNumbers = false;
  outsideDays = 'visible';
  

  constructor(
    private wkAllItemTypesService: WkAllItemTypesService,
    private changeDetectorRef: ChangeDetectorRef,
    private element: ElementRef,
    private router: Router
  ) { this._element = this.element.nativeElement }


  wkDataList: WkAllItemType[];
  searchDatas: any = {
    "str": "",
    "multiLineStr": "",
    "landLotNum": "",
    "date": null,
    "halfCharStr": "",
    "officeCd": "",
    "employeeCd": "",
    "heel": "",
    "num": "",
    "cntrctdPrprtyNo": "",
    "contactCd": "",
    "phoneNum": "",
    "time": "",
    "contractNum": "",
    "fullCharaStr": "",
    "multiCharStr": "",
    "yearAndMonth": "",
    "postalCd": "",
    "mstPopUpNum": "",
    "mstPopUpChar": "",
    "mstRadioBtnNum": "",
    "mstRadioBtnChar": "",
    "mstCheckBtn": "",
    "creationDate": null,
    "author": "",
    "updateDate": null,
    "changer": ""
  }

  pageIndex: number = 0;
  recordMax: number = 0;
  pageMax: number = 0;
  pageSize: number = 50;

  test: boolean = true;
  ngOnInit() {

    //検索URLをサービスが保持していれば
    if (this.wkAllItemTypesService.getSearchUrl()) {
      //再度検索し描画
      this.wkAllItemTypesService.search(this.wkAllItemTypesService.getSearchUrl())
        .subscribe(response => {
          let datas: WkAllItemType[] = response;
          this.recordMax = datas.length;
          this.pageMax = Math.floor(this.recordMax / this.pageSize);
          this.wkDataList = response;
        });
    }

    this.wkAllItemTypesService.wkAllItemTypeState
      .subscribe(response => {
        this.wkDataList = response
        this.clearPagenation();
      });

  }

  search() {
    this.wkAllItemTypesService.search(this.wkAllItemTypesService.createSearchUrl(this.searchDatas))
      .subscribe(response => {
        let datas: WkAllItemType[] = response;
        if (datas.length == 0) {
          alert("検索結果が1件もありません。条件を再度御確認ください。")
          return;
        }
        if (datas.length > 1000) {
          alert("検索結果が1000件を超えています。絞り込んでください。")
          return;
        }
        this.recordMax = datas.length;
        this.pageMax = Math.floor(datas.length / this.pageSize);
        this.wkDataList = datas
        this.changeDetectorRef.detectChanges()
      });

  }

  setPageIndex(pageIndex) {
    this.pageIndex = pageIndex;
  }

  clear() {
    for (let key of Object.keys(this.searchDatas)) {
      this.searchDatas[key] = "";
    }
  }
  viewEdit(id: number) {
    this.router.navigate([`/detail/${id}`]);
  }
  viewShow(id: number) {
    this.wkAllItemTypesService.setId(id);
  }
  viewCreate() {
  }
  viewDelete(id: number) {
    this.wkAllItemTypesService.setId(id);
  }

  clearPagenation() {
    this.pageIndex = 0;
    this.pageMax = 0;
    this.recordMax = 0;
  }

  pageJump(input: any) {
    if (Number(input.value) > this.pageMax || Number(input.value) < 0) {
      window.alert("不明なページです。選択可能なページ：" + "0 ~ " + this.pageMax);
      return;
    }
    this.pageIndex = Number(input.value);
  }

  printPdf() {
    this.wkAllItemTypesService.print(this.wkDataList);
  }
}
