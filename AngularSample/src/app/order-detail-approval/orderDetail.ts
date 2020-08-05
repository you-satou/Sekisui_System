export class OrderDetail{

    contactNum: string;
    propertyName: string;
    planOrderAmout:number;
    approvalRequestAmount:number;
    performanceOrderAmount:number;
    receivedAmount:number;
    progessRate:number;
    createdDetail:boolean;
    approval_1:boolean;
    approval_2:boolean;

}

export class OrderSearch{
    contactNumFrom:string;
    contactNumTo:string;
    propertyName:string;
    findBeginProName:boolean;
    findIncludeProName: boolean;
    detailCreateed:boolean;
    

}