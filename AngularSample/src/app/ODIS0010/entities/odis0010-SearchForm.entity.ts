/**
 * 発注明細＿承認処理画面の入力専用
 */
export class ODIS0010OrderSearchInputment {

    /** 契約番号From */
    contractNumFrom: string;

    /** 契約番号To */
    contractNumTo: string;

    /** 物件名 */
    propertyName: string;

    /** 明細あり */
    detailCreated: boolean;

    /** 明細なし */
    detailNone: boolean;

    /** 承認１ */
    approval_1: boolean;

    /** 承認２ */
    approval_2: boolean;

    /** 検索する形 */
    get searchByName(): string {
        if(this._checked){
            return '1' // １： 名称から始まる
        }
        else{
            return '2' //２：名称を含めて検索
        }
    }
    _checked: boolean;

    constructor() {}

    /** 入力をクリアする */
    Clear(){
        this.contractNumFrom = '';
        this.contractNumTo = '';
        this.propertyName = '';
        this._checked = true;
        this.detailCreated = false;
        this.detailNone = false;
        this.approval_1 = false;
        this.approval_2 = false;
    }
}

