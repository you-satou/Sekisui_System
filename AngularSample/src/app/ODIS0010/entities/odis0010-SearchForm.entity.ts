export class ODIS0010OrderSearchInputment {

    contractNumFrom: string;
    contractNumTo: string;
    propertyName: string;
    detailCreated: boolean;
    detailNone: boolean;
    approval_1: boolean;
    approval_2: boolean;

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

