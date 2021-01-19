import { Component, OnInit } from '@angular/core';
import { AppComponent } from '../../app.component'
import { Const } from '../../common/const'
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['../../common/common.component.css',
              './index.component.css'],
})

export class IndexComponent implements OnInit{
    
  _element: HTMLElement;

  constructor(
    private appComponent: AppComponent,
  ) { }

  ngOnInit() {
    // ヘッダー 設定
    this.appComponent.setHeader(Const.ScreenName.S0000);

  }

}
