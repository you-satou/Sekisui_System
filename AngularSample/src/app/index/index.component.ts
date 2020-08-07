import { Component, OnInit, OnDestroy, Output, EventEmitter, ChangeDetectorRef, ElementRef } from '@angular/core';
import { WkAllItemTypesService } from '../wk-all-item-types.service';
// import { IndexItemType } from '../IndexItemType';
import { Router } from '@angular/router';
import { OrderJournalSelectComponent } from '../order-journal-select/order-journal-select.component';
import { OrderJournalSelectService  } from '../order-journal-select/order-journal-select.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['../common/common.component.css',
              './index.component.css']
})

export class IndexComponent implements OnInit, OnDestroy   {
    
    _element: HTMLElement;

    // indexDataList: IndexItemType[]

    // モーダルダイアログが閉じた際のイベントをキャッチするための subscription
    private subscription: Subscription;
    // ngComponentOutlet にセットするためのプロパティ
    public modal: any = null;

    pageIndex: number = 0;
    recordMax: number = 0;
    pageMax: number = 0;
    pageSize: number = 50;

    constructor(
        private wkAllItemTypesService: WkAllItemTypesService,
        private changeDetectorRef: ChangeDetectorRef,
        private modalService: OrderJournalSelectService,
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
        this.subscription = this.modalService.closeEventObservable$.subscribe(
          () => {
            // プロパティ modal に null をセットすることでコンポーネントを破棄する
            // このタイミングで ModalComponent では ngOnDestroy が走る
            this.modal = null;
            location.reload();
          }
        );
    }
  /**
   * 終了処理
   *
   * @memberof AppComponent
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * クリックイベント
   *
   * @param {*} $event イベント情報
   * @memberof AppComponent
   */
  public onClick($event) {
    this.setModal();
  }

  /**
   * モーダルダイアログを表示する
   *
   * @private
   * @memberof AppComponent
   */
  private setModal() {
    this.modal = OrderJournalSelectComponent;
  }





}
