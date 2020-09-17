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
  
  /**背景色変更イベント*/
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

  /**カンマ付与編集 */
  private withComma(tgt):any{
    var s = String(tgt).split('.');
    var ret = String(s[0]).replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    if (s.length > 1 && s[1].length > 0) {
          ret += '.' + s[1];
    }
    return ret;
  }
    
  /**文字詰め */
  private padValue(tgt):any{
    return (Array(this.Max).join(this.Pad) + tgt).slice(-this.Max)
  }

  /**入力制限 */
  private saveInput(tgt){
    var ret:any;

    switch (this.Typ) {
      // 半角英数
      case CommonComponent.styleHarf:
        console.log("saveInput-harf");
        ret = tgt.replace(/[^0-9a-zA-Z]*$/g , "").slice(0,this.Max)
        break;

      // 半角数値
      case CommonComponent.styleHarfNum:
        console.log("saveInput-harfNum");
        ret = tgt.replace(/[^0-9]*$/g , "").slice(0,this.Max)
        break;

      // 数値 
      case CommonComponent.styleNumber:
        console.log("saveInput-Mony");
        // 数値以外を除外する（少数位が有れば付け足す）
        var s:string  = tgt.split(".")
        
        // マイナス表記判定
        var minusSign:number = (s[0].slice(0,1) == "-" )?1:0;
        
        // 最大文字数
        ret = s[0].replace(/[^0-9]/g,"").slice(0,(this.Max - minusSign));
        if (s.length > 1) {
          ret += "." + s[1].replace(/[^0-9]/g,"").slice(0,this.Dec);
        }
        
        // 最初の文字がマイナス記号の場合は先頭に付与
        if (minusSign == 1 ) {
          ret = "-" + ret
        }
        break;

      // 上記以外
      default:
        console.log("saveInput-default");
        ret = tgt.slice(0,this.Max);  
    }

    console.log("saveInput(前)：" + tgt);
    console.log("saveInput(後)：" + ret);

    return ret;
  }
}