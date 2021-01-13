import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Location } from '@angular/common'

// ↓↓ 追加 2021-01-06 アクセストークン追加に必要なクラスをインポート↓↓
import { ShRedirectService} from 'sh-http-client';
import { ShAppComponent } from "sh-form-control";
// ↑↑ 追加 2021-01-06 アクセストークン追加に必要なクラスをインポート↑↑

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

//↓↓↓↓↓↓↓↓↓↓↓↓↓
//TODO: エンティティーを別のファイルに移動する
/**
 * ユーザーの権限情報
 */
export class UserApprovalLevels {
  
  //承認１の権限
  approvalLv1: string;
  
  //承認２の権限
  approvalLv2: string;
  
  //承認３の権限
  approvalLv3: string;
  
  //最終承認の権限
  approvalFinal: string;
}
//↑↑↑↑↑↑↑↑↑↑↑↑

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    openClose
  ]
})
// ↓↓ 修正 2021-01-06　アクセストークン登録の為ShAppComponentを継承する ↓↓ 
//export class AppComponent implements OnInit {
export class AppComponent extends ShAppComponent implements OnInit {
// ↑↑ 修正 2021-01-06　アクセストークン登録の為ShAppComponentを継承する ↑↑

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

  loginUser: string;
  branchName: string;
  //承認数
  userApprovalLevels: UserApprovalLevels;

  constructor( 
    private router: Router, 
    private location: Location,
// ↓↓ 追加 2021-01-06 アクセストークン追加に必要なクラスを追加 ↓↓
    protected shRedirectService   : ShRedirectService
// ↑↑ 追加 2021-01-06 アクセストークン追加に必要なクラスを追加 ↑↑
    ) { 

// ↓↓ 追加 2021-01-06 親クラス(ShAppComponent)のコンストラクタ呼び出し ↓↓ 
      super(shRedirectService);
// ↑↑ 追加 2021-01-06 親クラス(ShAppComponent)のコンストラクタ呼び出し ↑↑
      
　   }
  ngOnInit() {
    //TODO:　アプリ起動する時、承認者数を取得する。
    this.approvalLevels = 4;
    //TODO: ログイン情報取得。
    this.loginUser = '積水　次郎';
    this.branchName = '大阪北支店';
    //TODO: ログイン情報から権限のデータを取得する
    this.userApprovalLevels = {
      approvalLv1: '1',
      approvalLv2: '1',
      approvalLv3: '1',
      approvalFinal: '1'
    }

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
