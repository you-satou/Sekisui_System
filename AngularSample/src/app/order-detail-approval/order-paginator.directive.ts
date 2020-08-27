import { ElementRef, AfterViewInit, Directive, Host, Optional, Renderer2, Self, ViewContainerRef, Input, OnInit, OnChanges, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatPaginator } from '@angular/material/paginator';
import { Key } from 'protractor';

interface PageObject {
    length: number;
    pageIndex: number;
    pageSize: number;
    previousPageIndex: number;
}

@Directive({
    selector: '[order-paginator]'
})

export class OrderApprovalPaginator {

    private _pageGapTxt: string = '...';
    private _rangeStart: number;
    private _rangeEnd: number;
    private _buttons = [];
    private _curPageObj: PageObject = {
        length: 0,
        pageIndex: 0,
        pageSize: 0,
        previousPageIndex: 0
    };
    private _showTotalPages = 2;


    @Input()
    get showTotalPages(): number {
        return this._showTotalPages;
    }
    set showTotalPages(value: number) {

        this._showTotalPages = value % 2 === 0 ? value + 1 : value;

    }

    get inc(): number {
        return this._showTotalPages % 2 === 0 ? this.showTotalPages / 2 : (this.showTotalPages + 1) / 2;
    }

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
        this.pagi.page.subscribe((e: PageObject) => {
            if (this._curPageObj.pageSize != e.pageSize &&
                this._curPageObj.pageIndex != 0
            ) {
                e.pageIndex = 0;
                this._rangeStart = 0;
                this._rangeEnd = this._showTotalPages - 1;
            }
            this._curPageObj = e;
            this.initPageRange();

        });
    }

    private initPageRange(): void {
        const middleIndex = (this._rangeStart + this._rangeEnd) / 2;
        this._rangeStart = this.calcRangeStart(middleIndex);
        this._rangeEnd = this.calcRangeEnd(middleIndex);

        this.buildInputPageNumber();
    }


    private buildInputPageNumber(){
      
      const labelTotalPages = this.viewRef.element.nativeElement.querySelector(
        "div.mat-paginator-range-label"
      );
        console.log(labelTotalPages);
      const actionContainer = this.viewRef.element.nativeElement.querySelector(
        "div.mat-paginator-range-actions"
      );

      let inputNode = this.viewRef.element.nativeElement.querySelector("input");
      setTimeout(() => {
        if(inputNode === null){
          const inputIndex: Input = this.rend.createElement("input");

          this.rend.addClass(inputIndex, "input-group");
          this.rend.addClass(inputIndex, "input-group-sm");
          this.rend.setStyle(inputIndex, "order","3");
          this.rend.setStyle(inputIndex, "max-width","40px");
          this.rend.setStyle(inputIndex, "text-align","right");
          this.rend.setStyle(inputIndex, "margin-left","10px");
          this.rend.listen(inputIndex, "keypress", ($event) => {
            this.switchPage($event);
            // alert("clicked!!");
          });
          this.rend.insertBefore(
            actionContainer,
            inputIndex,
            labelTotalPages
          )
        }
      });
    }
    
    // private createButton(i: any, pageIndex: number): any {
    //     const linkBtn: MatButton = this.rend.createElement("button");
    //     this.rend.addClass(linkBtn, "mat-mini-fab");
    //     this.rend.setStyle(linkBtn, "margin", "1%");
    //     this.rend.setStyle(linkBtn, "background-color", "white");
    
    //     const pagingTxt = isNaN(i) ? this._pageGapTxt : +(i + 1);
    //     const text = this.rend.createText(pagingTxt + "");
    
    //     this.rend.addClass(linkBtn, "mat-custom-page");
    //     switch (i) {
    //       case pageIndex:
    //         this.rend.setAttribute(linkBtn, "disabled", "disabled");
    //         break;
    //       case this._pageGapTxt:
    //         let newIndex = this._curPageObj.pageIndex + this._showTotalPages;
    
    //         if (newIndex >= this.numberOfPages) newIndex = this.lastPageIndex;
    
    //         if (pageIndex != this.lastPageIndex) {
    //           this.rend.listen(linkBtn, "click", () => {
    //             console.log("working: ", pageIndex);
    //             this.switchPage();
    //           });
    //         }
    
    //         if (pageIndex == this.lastPageIndex) {
    //           this.rend.setAttribute(linkBtn, "disabled", "disabled");
    //         }
    //         break;
    //       default:
    //         this.rend.listen(linkBtn, "click", () => {
    //           this.switchPage(i);
    //         });
    //         break;
    //     }
    
    //     this.rend.appendChild(linkBtn, text);
    //     this._buttons.push(linkBtn);
    //     return linkBtn;
    // }

    
      //Helper function To calculate start of button range
    private calcRangeStart(middleIndex: number): number {
        switch (true) {
          case this._curPageObj.pageIndex == 0 && this._rangeStart != 0:
            return 0;
          case this._curPageObj.pageIndex > this._rangeEnd:
            return this._curPageObj.pageIndex + this.inc > this.lastPageIndex
              ? this.lastPageIndex - this.inc * 2
              : this._curPageObj.pageIndex - this.inc;
          case this._curPageObj.pageIndex > this._curPageObj.previousPageIndex &&
            this._curPageObj.pageIndex > middleIndex &&
            this._rangeEnd < this.lastPageIndex:
            return this._rangeStart + 1;
          case this._curPageObj.pageIndex < this._curPageObj.previousPageIndex &&
            this._curPageObj.pageIndex < middleIndex &&
            this._rangeStart > 0:
            return this._rangeStart - 1;
          default:
            return this._rangeStart;
        }
    }

    // Helpter function to calculate end of button range
    private calcRangeEnd(middleIndex: number): number {
        switch (true) {
          case this._curPageObj.pageIndex == 0 &&
            this._rangeEnd != this._showTotalPages:
            return this._showTotalPages - 1;
          case this._curPageObj.pageIndex > this._rangeEnd:
            return this._curPageObj.pageIndex + this.inc > this.lastPageIndex
              ? this.lastPageIndex
              : this._curPageObj.pageIndex + 1;
          case this._curPageObj.pageIndex > this._curPageObj.previousPageIndex &&
            this._curPageObj.pageIndex > middleIndex &&
            this._rangeEnd < this.lastPageIndex:
            return this._rangeEnd + 1;
          case this._curPageObj.pageIndex < this._curPageObj.previousPageIndex &&
            this._curPageObj.pageIndex < middleIndex &&
            this._rangeStart >= 0 &&
            this._rangeEnd > this._showTotalPages - 1:
            return this._rangeEnd - 1;
          default:
            return this._rangeEnd;
        }
    }
    
    // Helper function to switch page on non first, last, next and previous buttons only.
    private switchPage(e:any): void {

      var key=e.keyCode || e.which;
      if (key==13){
        const previousPageIndex = this.pagi.pageIndex;
        this.pagi.pageIndex = 3;
        this.pagi["_emitPageEvent"](previousPageIndex);
        this.initPageRange();
      }
    }
    // Initialize default state after view init
    public ngAfterViewInit() {
        this._rangeStart = 0;
        this._rangeEnd = this._showTotalPages - 1;
        this.initPageRange();
    }

}