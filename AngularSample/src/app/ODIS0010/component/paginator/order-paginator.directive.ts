import { Directive, Renderer2, ViewContainerRef, Input } from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';

@Directive({
  selector: '[order-paginator]',
})

export class OrderApprovalPaginator extends MatPaginatorIntl {
  //各ボタンのラベルの名称
	itemsPerPageLabel	= '表示件数';
	
	nextPageLabel		= '次へ';

	previousPageLabel	= '戻る';
	
	firstPageLabel		= '最初へ';
	
  lastPageLabel		= '最後へ';

  inputNode: any = null;

  // ページ総数を習得する
  get numberOfPages(): number {
    return this.pagi.getNumberOfPages();
  }

  constructor(
    private readonly pagi: MatPaginator,
    private viewRef: ViewContainerRef,
    private rend: Renderer2
  ) {
      super();
  }

  ngOnInit(): void {
    this.inputNode = document.getElementById("pageIndex");
    //テキストボックスが存在しない場合、新規作成する。
    if (this.inputNode == null) {
      //テキストボックスを作成する
      this.createPageNumberTextBox();
    }

    //ボタン押下毎、走る
    this.pagi.page.subscribe(() => {
      this.buildInputPageNumber();
    });
  }

  private buildInputPageNumber() {
    //テキストボックスが存在しない場合、新規作成する。
    if (this.pagi.length > 0) {
      //データがある場合、ページ数を表示する
      this.inputNode.removeAttribute("disabled");
      this.inputNode.value = (this.pagi.pageIndex + 1).toString();
    }
    else {
      //検索した後、データがない場合、ページ数を空白して、非活性する。
      this.inputNode.value = "";
      this.inputNode.setAttribute("disabled", "true");
    }
  }

  private createPageNumberTextBox(){
    //総結果表示するラベルを取得する
    const labelTotalPages = this.viewRef.element.nativeElement.querySelector('div.mat-paginator-range-label');
    //各ボタンとラベルのＤＩＶを取得する
    const actionContainer = this.viewRef.element.nativeElement.querySelector('div.mat-paginator-range-actions');

    const inputIndex: Input = this.rend.createElement('input');
    // 各クラスを追加する。
    this.rend.addClass(inputIndex, 'input-group');
    this.rend.addClass(inputIndex, 'input-group-sm');
    this.rend.setStyle(inputIndex, 'order', '3');
    this.rend.setStyle(inputIndex, 'max-width', '40px');
    this.rend.setStyle(inputIndex, 'text-align', 'right');
    this.rend.setStyle(inputIndex, 'margin-left', '10px');
    this.rend.setAttribute(inputIndex, 'type', 'tel');
    this.rend.setAttribute(inputIndex, 'disabled', 'true');
    this.rend.setAttribute(inputIndex, 'id', 'pageIndex');
    this.rend.setAttribute(inputIndex, 'tabIndex', '16');
    //ＥＮＴＥＲキーを押下する時のエベントハンドラーを設定する
    this.rend.listen(inputIndex, 'keypress', ($event) => {
      this.switchPage($event);
    });
    // テキストボックスを作成する
    this.rend.insertBefore(actionContainer, inputIndex, labelTotalPages);
    this.inputNode = document.getElementById("pageIndex");
  }

  /** ページをジャップ */
  private switchPage(e: any): void {
    var key = e.keyCode || e.which;
    if (key == 13) {
      // 入力値を取得
      let txtInput = e.target.value;

      if (Number(txtInput) > 0 &&
        Number(txtInput) <= this.numberOfPages) {

        //テキストボックスに入力した切り替えページ数を設定する。
        this.pagi.pageIndex = Number(txtInput) - 1;
         //メッゾドを呼ぶ
        this.pagi['_emitPageEvent'](this.pagi.pageIndex);
      }
    }
  }

  ngAfterViewInit() {

    //パージネタをレンダーした後、ボタンの背景色を変える。
    this.setNewClass();
  }

  //各ボタンにBOOTSTRAPクラスに追加する
  private setNewClass(){
    let buttonNodes = document.querySelectorAll('div.mat-paginator-range-actions > button');
    let btnTabIndex = 14;
    buttonNodes.forEach(element => {

      element.classList.add('btn');
      element.classList.add('btn-link');
      element.classList.add('pagButtonsFocused');
      if(btnTabIndex === 16) btnTabIndex++;
      element.setAttribute('tabIndex', (btnTabIndex).toString());
      btnTabIndex++;
    });
  }

}

/** 取得結果ラベルを返す */
export function PaginatorResultLabel() {

  const paginator = new MatPaginatorIntl();

  paginator.getRangeLabel = function(page: number, pageSize: number, length: number){
    //結果が一件もない場合、表示しない
      if (length === 0 || pageSize === 0) {
          return '';
      }
      length = Math.max(length, 0);
      return '/ ' + (length % pageSize === 0 ? length / pageSize : (Math.floor(length / pageSize) +1));
  };
  return paginator;

}
