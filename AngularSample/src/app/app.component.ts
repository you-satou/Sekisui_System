import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

const openClose = trigger('openClose', [
  state('open', style({
    margin: 0
  })),
  state('closed', style({
    marginTop: '-300%'
  })),
  transition('open => closed', [
    animate('0.2s')
  ]),
  transition('closed => open', [
    animate('0.1s')
  ]),
])
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    openClose
  ]
})
export class AppComponent implements OnInit {

  // 初期化
  displayTitle: string = "";
  rootPath: string = "";
  frmPath: string = "";
  show: boolean = false;
  message_str: String = "";
  errorMessages: String[];
  errorFlg: boolean;
  mode: number;
  systemDate: Date = new Date();

  day: string[] = ["日", "月", "火", "水", "木", "金", "土"];

  constructor( 
    private router: Router, 
    ) {  }

  ngOnInit() {
    window.onpopstate = function (event) {
      history.pushState(null, null, null);
      window.alert('前のページに戻る場合、＊＊ボタンから戻ってください。');

    };
    window.document.onkeydown = function (event) {
      if (
        event.keyCode == 112 ||
        event.keyCode == 113 ||
        event.keyCode == 114 ||
        event.keyCode == 115 ||
        event.keyCode == 116 ||
        event.keyCode == 117 ||
        event.keyCode == 122
      ) {
        return false;
      };
      if (event.altKey && (event.keyCode == 37 || event.keyCode == 39)) {
        return false;
      }
      //Chromeでは動作しない
      if ((event.ctrlKey || event.metaKey) && event.keyCode == 78) {
        return false;
      }
      if ((event.ctrlKey || event.metaKey) && event.keyCode == 82) {
        return false;
      }
      if ((event.ctrlKey || event.metaKey) && event.keyCode == 68) {
        return false;
      }
    };
  }
  /**
   * ヘッダー 設定
   * @param strTitle 
   * @param strPath 
   */
  setHeader(strTitle:string, strPath:string = "") {
    this.displayTitle = strTitle;
    this.rootPath = strPath;
  }

  /**
   * ロカールに時刻を取得する
   */
  getSystemDate(): string {
    return `${this.systemDate.toLocaleDateString()}(${this.day[this.systemDate.getDay()]}) ${this.systemDate.toLocaleTimeString().slice(0, -3)}`;
  }

}
