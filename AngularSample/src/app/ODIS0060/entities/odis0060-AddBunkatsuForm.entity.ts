import { ODIS0060OrderDetailBunkatsu } from './odis0060-SplitDetail.entity';

/**
 * 発注明細に追加するの定義
 */
export class ODIS0020AddBunkatsu {

    /** 発注金額 */
    orderSplitAmount: string;

    /** 備考 */
    comment: string;

    /** 依頼日 */
    requestDate: string;

    /** 依頼者 */
    requester: string;

    get isBlank (): boolean {
        if(this.orderSplitAmount != '' ||
        this.comment != '' ||
        this.requestDate != '' ||
        this.requester != ''
        ){
            return false;
        }
        return true;
    } 

    get amountIsBlank(): boolean{
        if(this.orderSplitAmount != ''){
            return false;
        }
        return true;
    }

    constructor() {
        this.Clear();
    }

    Clear(){

        this.orderSplitAmount = '';
        this.comment = '';
        this.requestDate = '';
        this.requester = '';

    }

    /**
     * 入力テーブルの表示する値を設定する
     * @param input 
     */
    setInput(input: ODIS0060OrderDetailBunkatsu) {

        //編集テーブルの各セルに選択された行の値を挿入
        this.orderSplitAmount = input.orderSplitAmount;
        this.comment = input.comment;
        this.requestDate = input.requestDate;
        this.requester = input.requester;
    }

    getInput(output: ODIS0060OrderDetailBunkatsu): ODIS0060OrderDetailBunkatsu{

        output.orderSplitAmount = this.orderSplitAmount;
        output.comment = this.comment;
        output.requestDate = this.requestDate;
        output.requester = this.requester;
        
        return output;
    }

}

  /**
   * 
   */
  export class RowStatus {
    
    rowIndex: number;

    isSelected: boolean = false;
  
    constructor() {
      this.Reset();
    }
  
    Reset() {
      this.rowIndex = null;
      this.isSelected = false;
    }

    /**
     * 明細ステータス
     * @param status 明細を選択するかどうか
     * @param rowIndex 選択されている行の位置
     */
    setRowStatus(status:boolean, rowIndex: number){
        this.rowIndex = rowIndex;
        this.isSelected = status;
    }
  }