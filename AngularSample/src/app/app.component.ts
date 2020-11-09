import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Location } from '@angular/common'

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

  approvalLevels: number;

  constructor( 
    private router: Router, 
    private location: Location,
    ) {  }

  ngOnInit() {

    //TODO:　アプリ起動する時、承認者数を取得する。
    this.approvalLevels = 2;

    //新しいページに移動した場合、historyには新しいnullの情報を挿入。
    //そうすると、ブラウザーの戻るボタンを押下したら、前のページではなく、現在のページに戻る。
    this.location.onUrlChange((event) => {
      setTimeout(() => {
        history.pushState(null, null, null);
      }, 0);
    });

    //ブラウザーの戻るボタンを押下すると、historyにnullの情報を入れ、警告メッセージを表示。
    window.onpopstate = function(event) {
      history.pushState(null, null, null);
      window.alert('前のページに戻る場合、閉じるボタンから戻ってください。');

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

  ngOnDestroy(): void {

    sessionStorage.clear();
    
  }

}
