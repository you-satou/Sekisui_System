import {
  Directive,
  Host,
  Optional,
  Renderer2,
  Self,
  ViewContainerRef,
  Input,
} from '@angular/core';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';

interface PageObject {
  length: number;
  pageIndex: number;
  pageSize: number;
  previousPageIndex: number;
}

@Directive({
  selector: '[order-paginator]',
})
export class OrderApprovalPaginator extends MatPaginatorIntl {

	itemsPerPageLabel	= '表示件数';
	
	nextPageLabel		= '次へ';

	previousPageLabel	= '戻る';
	
	firstPageLabel		= '最初へ';
	
	lastPageLabel		= '最後へ';

  private _curPageObj: PageObject = {
    length: 0,
    pageIndex: 0,
    pageSize: 0,
    previousPageIndex: 0,
  };

  _inputText: string = '';

  @Input()

  get numberOfPages(): number {
    return this.pagi.getNumberOfPages();
  }

  get lastPageIndex(): number {
    return this.pagi.getNumberOfPages() - 1;
  }

  constructor(
    @Host()
    @Self()
    @Optional()
    private readonly pagi: MatPaginator,
    private viewRef: ViewContainerRef,
    private rend: Renderer2
  ) {
    // Needed method in order to extend by another class
    super();

    this.pagi.page.subscribe((e: PageObject) => {
      if (
        this._curPageObj.pageSize != e.pageSize &&
        this._curPageObj.pageIndex != 0
      ) {
        e.pageIndex = 0;
      }
      this._curPageObj = e;
      this.initPageRange();
    });
  }

  private initPageRange(): void {
    this.buildInputPageNumber();
  }

  private buildInputPageNumber() {
    const labelTotalPages = this.viewRef.element.nativeElement.querySelector(
      'div.mat-paginator-range-label'
    );
    const actionContainer = this.viewRef.element.nativeElement.querySelector(
      'div.mat-paginator-range-actions'
    );

    let inputNode = this.viewRef.element.nativeElement.querySelector('input');
    setTimeout(() => {
      if (inputNode === null) {
        const inputIndex: Input = this.rend.createElement('input');

        this.rend.addClass(inputIndex, 'input-group');
        this.rend.addClass(inputIndex, 'input-group-sm');
        this.rend.setStyle(inputIndex, 'order', '3');
        this.rend.setStyle(inputIndex, 'max-width', '40px');
        this.rend.setStyle(inputIndex, 'text-align', 'right');
        this.rend.setStyle(inputIndex, 'margin-left', '10px');
        this.rend.setAttribute(inputIndex, 'type', 'text');
        this.rend.setAttribute(inputIndex, 'disabled', 'disabled');
        this.rend.setAttribute(inputIndex, 'id', 'pageIndex');
        this.rend.setStyle(inputIndex,'display','disabled');
        this.rend.listen(inputIndex, 'keypress', ($event) => {
          this.switchPage($event);
        });
        this.rend.insertBefore(actionContainer, inputIndex, labelTotalPages);
      } else {
        this.rend.setProperty(inputNode, 'value', (this.pagi.pageIndex + 1).toString());

      }
    });
  }

  private switchPage(e: any): void {
    var key = e.keyCode || e.which;
    if (key == 13) {
      let txtInput = e.target.value;
      if (Number(txtInput) > 0 &&
        Number(txtInput) <= this.numberOfPages) {
        const currPageIndex = this.pagi.pageIndex;
        this.pagi.pageIndex = Number(txtInput) - 1;
        this.pagi['_emitPageEvent'](currPageIndex);
        this.initPageRange();
      }
    }
  }

  public ngAfterViewInit() {
    this.initPageRange();
  }

}

