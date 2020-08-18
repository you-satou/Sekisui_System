export class OrderDetail{

    public contractNum: string;
    public propertyName: string;
    public planOrderAmout:string;
    public approvalRequestAmount:string;
    public performanceOrderAmount:string;
    public receivedAmount:string;
    public progessRate:string;
    public createdDetail:string;
    public approval_1:string;
    public approval_2:string;

    constructor(){}
}

export class OrderSearchInputment{

    contractNumFrom:string;
    contractNumTo:string;
    propertyName:string;
    startFromName:boolean;
    includeProName: boolean;
    detailCreated:boolean;
    detailNone:boolean;
    approval_1:boolean;
    approval_2:boolean;
    resultASC:boolean;
    resultDESC:boolean;

    constructor(){}
    
}

