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

    // テーブル 背景色 クリア
    var wTbody: HTMLTableElement;
    var wTr: any;
    switch (event.target.nodeName) {
      case 'TD':
        wTr = event.path[1];
        wTbody = event.path[2];
        break;
      case 'SPAN':
        wTr = event.path[3];
        wTbody = event.path[4];
        break;
      case 'BUTTON':
        wTr = event.path[2];
        wTbody = event.path[3];
        break;
      case 'MAT-ICON':
        wTr = event.path[3];
        wTbody = event.path[4];
        break;
    }

    for (var i = 0; i < wTbody.rows.length; i++) {
      // 行 取得
      var t = wTbody.rows[i];
      t.style.backgroundColor = Const.HighLightColour.None;
    }
    // 要素取得

    wTr.style.backgroundColor = Const.HighLightColour.Selected;

  }

  /**
   * カンマ付与
   * @param 値
   * @returns 変換後 値
   */
  addCommas(val: string) {
    return val.replace(/(\d)(?=(\d\d\d)+$)/g, '$1,');
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


  /* データがNULL時、
  * 空白で返す
  * @param dt
  */
  setValue(dt: any) {

    if (dt != undefined || dt != null) {
      return dt;
    }
    return '';
  }

  /**
  * 行の背景色 変更する
  * @param action 追加・変更・未選択・選択
  * @param body 
  * @param rIndex row Index 
  */
  setRowColor(action: string, body: any, rIndex: number) {

    for (var i = 0; i < body.rows.length; i++) {
      if (i == rIndex) {
        var tr = body.rows[i];
        //明細追加または変更した時に、フォント色を変える
        if (action == Const.Action.A0001 || action == Const.Action.A0002) {
          tr.style.color = this.getColor(action);
        }
        else {
          tr.style.backgroundColor = this.getColor(action);
        }
      }
    }

  }

  getColor(action: string): string {

    switch (action) {
      case Const.Action.A0001:
        return Const.HighLightColour.Inserted;

      case Const.Action.A0002:
        return Const.HighLightColour.Modified;

      case Const.Action.T0003:
        return Const.HighLightColour.None;

      case Const.Action.T0001:
        return Const.HighLightColour.Selected;
    }

  }

  setUpdateColor(action: string, body: any, key: number, value: number) {

    for (var i = 0; i < body.rows.length; i++) {
      if (i == key) {
        var tr = body.rows[i];
        //明細追加または変更した時に、フォント色を変える
        if (action == Const.Action.A0001 || action == Const.Action.A0002) {
          // tr.style.color = this.getColor(action);
          for (let j = 0; j < 5; j++) {
            let cell = tr.cells[j];
            cell.style.color =  this.getColor(action);
          
            
          }
        }
      }
      if (i == value) {
        var tr = body.rows[i];
        //明細追加または変更した時に、フォント色を変える
        if (action == Const.Action.A0001 || action == Const.Action.A0002) {
          // tr.style.color = this.getColor(action);
          for (let j = 7; j < tr.cells.length; j++) {
            let cell = tr.cells[j];
            cell.style.color =  this.getColor(action);
            
          }
        }
      }
    }

  }

}