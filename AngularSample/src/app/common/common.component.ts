import { Const } from './const';
import { Input } from '@angular/core'

export class CommonComponent{

  /**
   * コンストラクタ
   * @param appComponent 
   */
  constructor(){}

  // 入力形式
  @Input() public Typ:number;

  // ラベル名
  @Input() public lbl:String;
  
  // 値
  @Input() public Txt: string;
  
  @Input() public Val: string;
  
  // 必須
  @Input() public Req:boolean;
  
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
  static get styleAny():number { return 0 }        // フリー
  static get styleHarf():number { return 1 }       // 半角英数　a~z A~Z 0~9
  static get styleHarfNum():number { return 2 }    // 半角数値　0~9
  static get styleNumber():number { return 3 }       // 数値、"."(カンマ※1つまで)、"-"（マイナス※先頭文字のみ）
  
  /**
   * 背景色変更イベント
   */
  public CommonOnSelHight(event:any){

    // テーブル 背景色 クリア
    var wTbody = event.target.parentElement.parentElement;
    for(var i=0; i<wTbody.rows.length; i++){
      // 行 取得
      var wTr = wTbody.rows[i];
      for(var j=0; j<wTr.cells.length; j++){
        // セル クリア
        var wTd = wTr.cells[j];
        wTd.style.backgroundColor = Const.HighLightColour.None;
      }
    }

    // 要素取得
    var wTr = event.target.parentElement;

    // 背景色 変更
    for(var i=0; i<wTr.cells.length; i++){
      var wTd = wTr.cells[i];
      wTd.style.backgroundColor = Const.HighLightColour.Selected;
    }
  }

  /**
   * カンマ付与
   * @param 値
   * @returns 変換後 値
   */
  addCommas(val:string){
    return val.replace(/(\d)(?=(\d\d\d)+$)/g, '$1,');
  }

   /**
   * カンマ除去
   * @param 値
   * @returns 変換後 値
   */
  removeCommas(val:string){
    return val.replace(/,/g, '');
  }

  /**
   * 0パディング
   * @param 値
   * @param 桁数
   * @returns 変換後 値
   */
  getZeroPadding(val:string, digit:number){
    var strVal = val;
    // 桁数分 0埋め
    for(var i=strVal.length; i<digit; i++){
      strVal = "0" + strVal; 
    }
    return strVal; 
  }
}