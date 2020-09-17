import { Component, OnInit, ElementRef } from '@angular/core';
import { IndexService } from '../services/index.service'
import { AppComponent } from '../../app.component'
import { Const } from '../../common/const'
//import { countReset } from 'console';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['../../common/common.component.css',
              './index.component.css'],
})

export class IndexComponent implements OnInit{
    
  _element: HTMLElement;

  constructor(
      private element: ElementRef,
      private appComponent: AppComponent,
      private indexService: IndexService, 
  ) { this._element = this.element.nativeElement
  }

  ngOnInit() {
      // ヘッダー 設定
      this.appComponent.setHeader(Const.ScreenName.S0000);
  }

}
