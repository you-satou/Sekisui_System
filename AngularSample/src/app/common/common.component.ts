import { element } from 'protractor';
import { style } from '@angular/animations';
import { Const } from './const';
import { Input } from '@angular/core'

export class CommonComponent {

  /**
   * コンストラクタ
   * @param appComponent 
   */
  constructor() { }

  // 入力形式
  @Input() public Typ: number;

  // ラベル名
  @Input() public lbl: String;

  // 値
  @Input() public Txt: string;

  @Input() public Val: string;

  // 必須
  @Input() public Req: boolean;

  // 文字詰（金額型の場合は使用しない）
  @Input() public PadFlg: boolean;
  @Input() public Pad: string;

  // 桁管理
  @Input() public Min: number;
  @Input() public Max: number;
  @Input() public Dec: number;

  // 正規表現チェック拡張
  @Input() public RegExp: string;

  // 入力形式
  static get styleAny(): number { return 0 }        // フリー
  static get styleHarf(): number { return 1 }       // 半角英数　a~z A~Z 0~9
  static get styleHarfNum(): number { return 2 }    // 半角数値　0~9
  static get styleNumber(): number { return 3 }       // 数値、"."(カンマ※1つまで)、"-"（マイナス※先頭文字のみ）

  /**
   * 背景色変更イベント
   */
  public CommonOnSelHight(event: any) {
    //クリックされたエレメント名を取得する
    var nodeName = event.target.nodeName;
    //テーブルのBody
    var wTbody: HTMLTableElement;
    //クリックされた行
    var wTr: any;
    
    switch (nodeName) {
      case 'TR':
        wTr = event.path[0];
        wTbody = event.path[1];
        break;
      case 'TD':
        wTr = event.path[1];
        wTbody = event.path[2];
        break;
      case 'MAT-ICON':
        wTr = event.path[4];
        wTbody = event.path[5];
        break;
      case 'LABEL':
        wTr = event.path[2];
        wTbody = event.path[3];
        break;

        // //依頼・承認ボタン・分割注文書発行区分チェックボックスを押下した後、明細変更テーブルにデータを表示しない。
      case 'SPAN':
        wTr = event.path[3];
        wTbody = event.path[4];
        break;
      case 'BUTTON':
        wTr = event.path[2];
        wTbody = event.path[3];
        break;

      case 'INPUT':
        wTr = event.path[2];
        wTbody = event.path[3];
        break;
    }

    //テーブルの背景色をクリアする。
    for (var i = 0; i < wTbody.rows.length; i++) {
      var tr = wTbody.rows[i];
      for(var j = 0; j < tr.cells.length; j++) {
        var td = tr.cells[j];
        td.style.backgroundColor = Const.HighLightColour.None;
      }
    }
    // クリックされた行の背景色を変える。
    for(var i = 0; i < wTr.cells.length; i++) {
      var wTd = wTr.cells[i];
      wTd.style.backgroundColor = Const.HighLightColour.Selected;
    }
  }

  /**
   * カンマ付与
   * @param 値
   * @returns 変換後 値
   */
  addCommas(val: string) {
    var str = Number(val).toString();
    return str.replace(/(\d)(?=(\d\d\d)+$)/g, '$1,');
  }

  /**
  * カンマ除去
  * @param 値
  * @returns 変換後 値
  */
  removeCommas(val: string) {
    return val.replace(/,/g, '');
  }

  /**
   * 0パディング
   * @param 値
   * @param 桁数
   * @returns 変換後 値
   */
  getZeroPadding(val: string, digit: number) {
    var strVal = val;
    // 桁数分 0埋め
    for (var i = strVal.length; i < digit; i++) {
      strVal = "0" + strVal;
    }
    return strVal;
  }

  /**

   * 半角⇒全角　変換
   * 
   */
  onChangeZenkaku(value: string) {

    var resultValue = "";

    var beforeTextArr = String(value).split('');

    var han = new Array('ｱ', 'ｲ', 'ｳ', 'ｴ', 'ｵ',
      'ｶ', 'ｷ', 'ｸ', 'ｹ', 'ｺ',
      'ｻ', 'ｼ', 'ｽ', 'ｾ', 'ｿ',
      'ﾀ', 'ﾁ', 'ﾂ', 'ﾃ', 'ﾄ',
      'ﾅ', 'ﾆ', 'ﾇ', 'ﾈ', 'ﾉ'
      , 'ﾊ', 'ﾋ', 'ﾌ', 'ﾍ', 'ﾎ'
      , 'ﾏ', 'ﾐ', 'ﾑ', 'ﾒ', 'ﾓ'
      , 'ﾔ', 'ﾕ', 'ﾖ'
      , 'ﾗ', 'ﾘ', 'ﾙ', 'ﾚ', 'ﾛ'
      , 'ﾜ', 'ｦ', 'ﾝ'
      , 'ｧ', 'ｨ', 'ｩ', 'ｪ', 'ｫ'
      , 'ｬ', 'ｭ', 'ｮ', 'ｯ'
      , '､', '｡', 'ｰ', '｢', '｣', 'ﾞ', 'ﾟ'
      , 'ｳﾞ', 'ｶﾞ', 'ｷﾞ', 'ｸﾞ', 'ｹﾞ', 'ｺﾞ'
      , 'ｻﾞ', 'ｼﾞ', 'ｽﾞ', 'ｾﾞ', 'ｿﾞ'
      , 'ﾀﾞ', 'ﾁﾞ', 'ﾂﾞ', 'ﾃﾞ', 'ﾄﾞ'
      , 'ﾊﾞ', 'ﾋﾞ', 'ﾌﾞ', 'ﾍﾞ', 'ﾎﾞ'
      , 'ﾊﾟ', 'ﾋﾟ', 'ﾌﾟ', 'ﾍﾟ', 'ﾎﾟ'
    );
    var txt = new Array('ア', 'イ', 'ウ', 'エ', 'オ'
      , 'カ', 'キ', 'ク', 'ケ', 'コ'
      , 'サ', 'シ', 'ス', 'セ', 'ソ'
      , 'タ', 'チ', 'ツ', 'テ', 'ト'
      , 'ナ', 'ニ', 'ヌ', 'ネ', 'ノ'
      , 'ハ', 'ヒ', 'フ', 'ヘ', 'ホ'
      , 'マ', 'ミ', 'ム', 'メ', 'モ'
      , 'ヤ', 'ユ', 'ヨ'
      , 'ラ', 'リ', 'ル', 'レ', 'ロ'
      , 'ワ', 'ヲ', 'ン'
      , 'ァ', 'ィ', 'ゥ', 'ェ', 'ォ'
      , 'ャ', 'ュ', 'ョ', 'ッ'
      , '、', '。', 'ー', '「', '」', '”', ''
      , 'ヴ', 'ガ', 'ギ', 'グ', 'ゲ', 'ゴ'
      , 'ザ', 'ジ', 'ズ', 'ゼ', 'ゾ'
      , 'ダ', 'ヂ', 'ヅ', 'デ', 'ド'
      , 'バ', 'ビ', 'ブ', 'ベ', 'ボ'
      , 'パ', 'ピ', 'プ', 'ペ', 'ポ'
    );

    for (var i = 0; i < value.length; i++) {

      var c = "";
      c = beforeTextArr[i];

      if (c.match(/^[ｦ-ﾟ]*$/)) {
        for (var j = 0; j < han.length; j++) {
          if (c == han[j].toString()) {
            c = txt[j].toString();
          }
        }
      } else if (c.match(/[A-Z a-z 0-9 !-~]/)) {
        c = String.fromCharCode(c.charCodeAt(0) + 0xFEE0);
      }
      else { }
      resultValue += c
    }

    return resultValue;
  }

  /**
   * 全角⇒半角　変換
   * 
   */
  onChangeHankaku(value: string) {

    var resultValue = "";

    var beforeTextArr = String(value).split('');

    for (var i = 0; i < value.length; i++) {

      var c = "";
      c = beforeTextArr[i];

      if (c.match(/[Ａ-Ｚａ-ｚ０-９！-～]/)) {

        c = String.fromCharCode(c.charCodeAt(0) - 0xFEE0);
      }
      resultValue += c
    }

    return resultValue;
  }

  /**
   * 入力値制限 半角数字以外削除
   * 
   */
  onlyHanNumber(value: string) {

    var resultValue = "";

    var beforeTextArr = String(value).split('');

    for (var i = 0; i < value.length; i++) {

      var c = "";
      c = beforeTextArr[i];

      if (c.match(/[^0-9]/)) {
        c = '';
      }
      resultValue += c
    }
    return resultValue;
  }

    /**
   * 入力値制限 半角金額以外削除
   * 
   */
  onlyHanPrice(value: string) {

    var resultValue = "";

    var beforeTextArr = String(value).split('');

    for (var i = 0; i < value.length; i++) {

      var c = "";
      c = beforeTextArr[i];

      //マイナスはＯＫ
      if(i == 0 && c.match(/[-]/)){

      }
      else if (c.match(/[^0-9]/)) {        
          c = '';
      }
      resultValue += c
    }
    return resultValue;
  }

  /**
   * 入力値制限 半角英数字以外削除
   * 
   */
  onlyHanABCNumber(value: string) {

    var resultValue = "";

    var beforeTextArr = String(value).split('');

    for (var i = 0; i < value.length; i++) {

      var c = "";
      c = beforeTextArr[i];

      if (c.match(/[^0-9 A-Z a-z]/)) {
        c = '';
      }
      resultValue += c
    }
    return resultValue;
  }



  /**
   * 入力値制限 全角以外削除
   * 
   */
  onlyZenkaku(value: string) {

    var resultValue = "";

    var beforeTextArr = String(value).split('');

    for (var i = 0; i < value.length; i++) {

      var c = "";
      c = beforeTextArr[i];

      if (c.match(/[ｦ-ﾟ A-Z a-z 0-9 !-~]/)) {
        c = '';
      }
      resultValue += c
    }
    return resultValue;
  }


 /** データがNULL時、
  * 空白で返す
  * @param dt
  */
  setValue(dt: any) {

    if (dt == undefined || dt == null) {
      return '';
    }
    return dt;
  }

   /** データがNULL時、
  * @param dt
  * @return bool
  */
 isEmpty(dt: any):boolean {

  if (dt == undefined || dt == null) {
    return true;
  }
  return false;
 }

  /**
  * 行の背景色を設定する
  * @param action 追加・変更・未選択・選択
  * @param body 
  * @param rIndex row Index 
  * @param bulkApproval 一括承認
  */
  setRowColor(action: string, body: any, rIndex: number, bulkApproval?: any) {

    for (var i = 0; i < body.rows.length; i++) {
      const tr = body.rows[i];
      //TODO: 中止ボタンを押下した場合、追加・更新されていない行の背景色を白にする
      if (this.setValue(rIndex) == '' && action == Const.Action.A0006) {
        for (var j = 0; j < tr.cells.length; j++) {
          var td = tr.cells[j];
          td.style.backgroundColor = this.getColor(action);
        }
      }
      //追加・更新されている行のフォント色・背景色を変える
      if (i == rIndex) {
        if (action == Const.Action.A0001 || action == Const.Action.A0002) {

          for (var j = 0; j < tr.cells.length; j++) {
            var td = tr.cells[j];
            //フォント色が赤か透明じゃない文字を青か黄色にする
            if(td.style.color != Const.HighLightColour.Red && td.style.color != Const.HighLightColour.Transparent) {
              td.style.color = this.getColor(action);
            }
            //承認されていない明細の背景色をしろにする
            if (this.setValue(bulkApproval) == '') {
              td.style.backgroundColor = '';
            }
          }
        } else {
          //分割画面から詳細入力画面に戻る場合、遷移する前に選択された行の背景色を青にする
          //中止ボタンを押下した場合、行の背景色を白にする（詳細入力画面を除く）
          for (var j = 0; j < tr.cells.length; j++) {
            var td = tr.cells[j];
            td.style.backgroundColor = this.getColor(action);
          }
        }

      }
    }
  }

  getColor(action: string): string {

    switch (action) {
      //行を追加する
      case Const.Action.A0001:
        return Const.HighLightColour.Inserted;
      //行を変更する
      case Const.Action.A0002:
        return Const.HighLightColour.Modified;
      //行を外す
      case Const.Action.A0006:
        return Const.HighLightColour.None;
      //行を選択する
      case Const.Action.A0004:
        return Const.HighLightColour.Selected;
    }

  }

  /**
   * フォーカスを設定する
   * @param elementId 
   */
  setFocus(elementId: string){

    var element: HTMLElement = document.getElementById(elementId);
    element.focus();
  }

}